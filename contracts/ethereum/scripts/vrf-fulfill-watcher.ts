#!/usr/bin/env tsx
/**
 * Local Hardhat only: polls for `BreedRandomnessRequested` on CryptoPets and calls
 * `VRFCoordinatorV2_5Mock.fulfillRandomWords` (simulates Chainlink fulfillment).
 *
 * Run alongside the node (e.g. `pnpm eth:vrf:watch` or via `fe:eth:local`).
 *
 * Env:
 *   HARDHAT_RPC — default http://127.0.0.1:8545
 *   VRF_FULFILLER_PRIVATE_KEY — default Hardhat account #0
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import {
    createPublicClient,
    createWalletClient,
    http,
    parseAbiItem,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

const RPC_URL = process.env.HARDHAT_RPC ?? "http://127.0.0.1:8545";
const FULFILLER_KEY = (process.env.VRF_FULFILLER_PRIVATE_KEY ??
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as `0x${string}`;

const localDeployerAbi = [
    {
        type: "function",
        name: "cryptoPets",
        inputs: [],
        outputs: [{ type: "address", name: "" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "vrfCoordinator",
        inputs: [],
        outputs: [{ type: "address", name: "" }],
        stateMutability: "view",
    },
] as const;

const vrfCoordinatorAbi = [
    {
        type: "function",
        name: "fulfillRandomWords",
        inputs: [
            { name: "_requestId", type: "uint256" },
            { name: "_consumer", type: "address" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
] as const;

const breedRequestedEvent = parseAbiItem(
    "event BreedRandomnessRequested(address indexed owner, uint256 indexed requestId, uint256 petId1, uint256 petId2)"
);

async function resolveLocalContracts(
    publicClient: ReturnType<typeof createPublicClient>
): Promise<{
    cryptoPets: `0x${string}`;
    vrfCoordinator: `0x${string}`;
} | null> {
    const path = join(
        process.cwd(),
        "ignition",
        "deployments",
        "chain-31337",
        "deployed_addresses.json"
    );
    if (!existsSync(path)) return null;
    const deployed = JSON.parse(readFileSync(path, "utf8")) as Record<
        string,
        string
    >;
    const deployer = (deployed["CryptoPetsModule#localDeployer"] ??
        deployed["CryptoPetsModule#LocalCryptoPetsDeployer"]) as
        | `0x${string}`
        | undefined;
    if (!deployer) return null;

    const cryptoPets = (await publicClient.readContract({
        address: deployer,
        abi: localDeployerAbi,
        functionName: "cryptoPets",
    })) as `0x${string}`;
    const vrfCoordinator = (await publicClient.readContract({
        address: deployer,
        abi: localDeployerAbi,
        functionName: "vrfCoordinator",
    })) as `0x${string}`;

    return { cryptoPets, vrfCoordinator };
}

async function main(): Promise<void> {
    const account = privateKeyToAccount(FULFILLER_KEY);
    const publicClient = createPublicClient({
        chain: hardhat,
        transport: http(RPC_URL),
    });
    const walletClient = createWalletClient({
        account,
        chain: hardhat,
        transport: http(RPC_URL),
    });

    console.log("[vrf-watch] RPC:", RPC_URL);
    console.log("[vrf-watch] Waiting for node + LocalCryptoPetsDeployer…");

    let contracts: Awaited<ReturnType<typeof resolveLocalContracts>> = null;
    for (let i = 0; i < 120; i++) {
        try {
            await publicClient.getBlockNumber();
            contracts = await resolveLocalContracts(publicClient);
            if (contracts) break;
        } catch {
            /* node not up */
        }
        await delay(1000);
    }

    if (!contracts) {
        console.error(
            "[vrf-watch] Timed out: no deployment at ignition/deployments/chain-31337/deployed_addresses.json"
        );
        process.exit(1);
    }

    console.log("[vrf-watch] CryptoPets:", contracts.cryptoPets);
    console.log("[vrf-watch] VRF mock:", contracts.vrfCoordinator);
    console.log("[vrf-watch] Listening (poll every 2s)…");

    const fulfilled = new Set<string>();
    let fromBlock = 0n;

    for (;;) {
        await delay(2000);
        const head = await publicClient.getBlockNumber();
        if (head < fromBlock) continue;

        const logs = await publicClient.getLogs({
            address: contracts.cryptoPets,
            event: breedRequestedEvent,
            fromBlock,
            toBlock: head,
        });

        fromBlock = head + 1n;

        for (const log of logs) {
            const requestId = log.args.requestId;
            if (requestId == null) continue;
            const key = requestId.toString();
            if (fulfilled.has(key)) continue;

            fulfilled.add(key);
            try {
                // Coordinator API (mock): fulfillRandomWords(requestId, consumer).
                // Different from CryptoPets.fulfillRandomWords(requestId, randomWords) — the
                // coordinator generates words and `call`s the consumer.
                const hash = await walletClient.writeContract({
                    address: contracts.vrfCoordinator,
                    abi: vrfCoordinatorAbi,
                    functionName: "fulfillRandomWords",
                    args: [requestId, contracts.cryptoPets],
                });
                console.log("[vrf-watch] Fulfilled request", key, "→", hash);
            } catch (e) {
                console.error("[vrf-watch] fulfillRandomWords failed:", key, e);
            }
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
