import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { parseEventLogs } from "viem";
import { getTestClient } from "viem/actions";

describe("CryptoPets", async function () {
    const { viem } = await network.connect();

    async function deployCryptoPets() {
        const deployer = await viem.deployContract("LocalCryptoPetsDeployer", [], {
            value: 100_000_000_000_000_000_000n
        });
        const cryptoPetsAddr = await deployer.read.cryptoPets();
        const cryptoPets = await viem.getContractAt("CryptoPets", cryptoPetsAddr);
        const vrfAddr = await deployer.read.vrfCoordinator();
        const vrf = await viem.getContractAt("VRFCoordinatorV2_5Mock", vrfAddr);
        return { cryptoPets, vrf };
    }

    it("Should set the correct name and symbol", async function () {
        const { cryptoPets } = await deployCryptoPets();

        assert.equal(await cryptoPets.read.name(), "CryptoPets");
        assert.equal(await cryptoPets.read.symbol(), "PETS");
    });

    it("Should create a pet successfully", async function () {
        const { cryptoPets } = await deployCryptoPets();
        const [, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet"], { account: addr1.account });

        assert.equal(await cryptoPets.read.getTotalCount(), 1n);
        assert.equal(await cryptoPets.read.balanceOf([addr1.account.address]), 1n);
        assert.equal(await cryptoPets.read.ownerPetCount([addr1.account.address]), 1n);
    });

    it("Should not allow creating multiple pets for same address", async function () {
        const { cryptoPets } = await deployCryptoPets();
        const [, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet1"], { account: addr1.account });

        try {
            await cryptoPets.write.createRandom(["TestPet2"], { account: addr1.account });
            assert.fail("Expected transaction to revert");
        } catch (error: unknown) {
            assert((error as Error).message.includes("You already have a pet!"));
        }
    });

    it("Should return correct pet data", async function () {
        const { cryptoPets } = await deployCryptoPets();
        const [, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet"], { account: addr1.account });

        const pet = await cryptoPets.read.getById([1n]);

        assert.equal(pet.name, "TestPet");
        assert.equal(pet.level, 1);
        assert.equal(pet.winCount, 0);
        assert.equal(pet.lossCount, 0);
    });

    it("Should level up pet with correct fee", async function () {
        const { cryptoPets } = await deployCryptoPets();
        const [, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet"], { account: addr1.account });

        const levelUpFee = await cryptoPets.read.LEVEL_UP_FEE();

        await cryptoPets.write.levelUp([1n], {
            account: addr1.account,
            value: levelUpFee
        });

        const [level] = await cryptoPets.read.getStats([1n]);
        assert.equal(level, 2);
    });

    it("Should reject level up with incorrect fee", async function () {
        const { cryptoPets } = await deployCryptoPets();
        const [, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet"], { account: addr1.account });

        try {
            await cryptoPets.write.levelUp([1n], {
                account: addr1.account,
                value: 2000000000000000n
            });
            assert.fail("Expected transaction to revert");
        } catch (error: unknown) {
            assert((error as Error).message.includes("Incorrect fee amount"));
        }
    });

    it("Should breed using Chainlink VRF mock", async function () {
        const { cryptoPets, vrf } = await deployCryptoPets();
        const publicClient = await viem.getPublicClient();
        const testClient = getTestClient(publicClient);

        const [, addr1, addr2] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["ParentA"], { account: addr1.account });
        await cryptoPets.write.createRandom(["ParentB"], { account: addr2.account });

        await testClient.increaseTime({ seconds: 30 });
        await testClient.mine({ blocks: 1 });

        const reqHash = await cryptoPets.write.requestCreateFromDNA(
            [1n, 2n, "Offspring"],
            { account: addr1.account }
        );
        const reqReceipt = await publicClient.waitForTransactionReceipt({ hash: reqHash });
        const reqLogs = parseEventLogs({
            abi: cryptoPets.abi,
            logs: reqReceipt.logs,
            eventName: "BreedRandomnessRequested",
            strict: false
        });
        const requestId = reqLogs[0].args.requestId;
        assert(requestId != null);

        // VRFCoordinatorV2_5Mock: (requestId, consumer) — not the consumer callback shape.
        await vrf.write.fulfillRandomWords([requestId, cryptoPets.address], {
            account: addr1.account
        });

        assert.equal(await cryptoPets.read.getTotalCount(), 3n);
        assert.equal(await cryptoPets.read.balanceOf([addr1.account.address]), 2n);
    });
});
