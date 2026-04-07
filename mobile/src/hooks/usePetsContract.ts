import { useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, isContractConfigured } from '../contractConfig';
import ethereumAbi from '../contracts/ethereumAbi.json';

/** Pet entity from `getById`. */
export interface Pet {
    name: string;
    dna: bigint;
    level: number;
    readyTime: bigint;
    winCount: number;
    lossCount: number;
    rarity: number;
}

export function usePetsContract() {
    const { address } = useAccount();
    const {
        writeContract,
        data: hash,
        isPending: isWritePending,
        error: writeError,
        reset,
    } = useWriteContract();

    const readsEnabled = !!address && isContractConfigured && !!CONTRACT_ADDRESS;

    const {
        data: petIdsData,
        refetch: refetchPetIds,
        isLoading: isLoadingIds,
        error: petIdsError,
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ethereumAbi.abi,
        functionName: 'getByOwner',
        args: address ? [address] : undefined,
        query: {
            enabled: readsEnabled,
        },
    });

    const petReadContracts =
        (petIdsData as bigint[] | undefined)?.map((petId: bigint) => ({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: ethereumAbi.abi as never,
            functionName: 'getById' as const,
            args: [petId],
        })) ?? [];

    const {
        data: petsData,
        isLoading: isPetsLoading,
        error: petsError,
    } = useReadContracts({
        contracts: petReadContracts,
        query: {
            enabled: readsEnabled && petReadContracts.length > 0,
        },
    });

    const pets: Pet[] =
        (petsData as { status: string; result?: unknown }[] | undefined)
            ?.filter((result) => result.status === 'success' && result.result != null)
            .map((result) => {
                const raw = result.result as {
                    name: string;
                    dna: bigint;
                    level: number;
                    readyTime: bigint;
                    winCount: number;
                    lossCount: number;
                    rarity: number;
                };
                return {
                    name: raw.name,
                    dna: BigInt(raw.dna),
                    level: Number(raw.level),
                    readyTime: BigInt(raw.readyTime),
                    winCount: Number(raw.winCount),
                    lossCount: Number(raw.lossCount),
                    rarity: Number(raw.rarity),
                };
            }) ?? [];

    const petIds: bigint[] = (petIdsData as bigint[]) ?? [];

    const getRarityName = (rarity: number): string => {
        const names: Record<number, string> = {
            1: 'Common',
            2: 'Uncommon',
            3: 'Rare',
            4: 'Epic',
            5: 'Legendary',
        };
        return names[rarity] ?? 'Unknown';
    };

    const getRarityColor = (rarity: number): string => {
        const colors: Record<number, string> = {
            1: '#8B4513',
            2: '#C0C0C0',
            3: '#FFD700',
            4: '#FF69B4',
            5: '#8A2BE2',
        };
        return colors[rarity] ?? '#8B4513';
    };

    const isLoading =
        readsEnabled && (isLoadingIds || (petReadContracts.length > 0 && isPetsLoading));

    const createRandomPet = useCallback(
        (name: string) => {
            if (!CONTRACT_ADDRESS || !isContractConfigured) {
                return;
            }
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: ethereumAbi.abi,
                functionName: 'createRandom',
                args: [name],
                gas: 500000n,
            });
        },
        [writeContract],
    );

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({
        hash,
        query: {
            enabled: !!hash,
        },
    });

    useEffect(() => {
        if (!isConfirmed) {
            return;
        }
        void refetchPetIds();
        reset();
    }, [isConfirmed, refetchPetIds, reset]);

    return {
        pets,
        petIds,
        isLoading,
        contractError: petIdsError ?? petsError,
        refetchPetIds,
        getRarityName,
        getRarityColor,
        isContractConfigured,
        createRandomPet,
        isWritePending,
        writeError,
        isConfirming,
        txHash: hash,
    };
}
