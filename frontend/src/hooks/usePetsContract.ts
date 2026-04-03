import { useAccount, useWriteContract, useReadContract, useReadContracts } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config';
import ethereumAbi from '../contracts/ethereumAbi.json';

/** Pet entity returned from the contract reader (`getById`). */
export interface Pet {
    name: string;
    dna: bigint;
    level: number;
    readyTime: bigint;
    winCount: number;
    lossCount: number;
    rarity: number;
}

export interface PetStats {
    level: number;
    winCount: number;
    lossCount: number;
    rarity: number;
}

export interface BattleStats {
    winCount: number;
    lossCount: number;
    readyTime: bigint;
}

export const usePetsContract = () => {
    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

    const { data: petIdsData, refetch: refetchPetIds } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: ethereumAbi.abi,
        functionName: 'getByOwner',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    const petReadContracts = (petIdsData as bigint[])?.map((petId: bigint) => ({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ethereumAbi.abi as any,
        functionName: 'getById' as const,
        args: [petId],
    })) || [];

    const { data: petsData, isLoading: isPetsLoading, error: petsError } = useReadContracts({
        contracts: petReadContracts,
        query: {
            enabled: petReadContracts.length > 0,
        },
    });

    const pets: Pet[] = petsData
        ?.filter((result: any) => result.status === 'success' && result.result)
        .map((result: any) => {
            const raw = result.result as any;
            return {
                name: raw.name,
                dna: BigInt(raw.dna),
                level: Number(raw.level),
                readyTime: BigInt(raw.readyTime),
                winCount: Number(raw.winCount),
                lossCount: Number(raw.lossCount),
                rarity: Number(raw.rarity),
            } as Pet;
        }) || [];

    const petIds: bigint[] = (petIdsData as bigint[]) || [];

    const createRandomPet = (name: string) => {
        return writeContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'createRandom',
            args: [name],
            gas: 500000n,
        });
    };

    const levelUp = (petId: bigint) => {
        return writeContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'levelUp',
            args: [petId],
            value: 1000000000000000n,
            gas: 200000n,
        });
    };

    const changeName = (petId: bigint, newName: string) => {
        return writeContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'changeName',
            args: [petId, newName],
            gas: 100000n,
        });
    };

    const battlePets = (petId1: bigint, petId2: bigint) => {
        return writeContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'battle',
            args: [petId1, petId2],
            gas: 300000n,
        });
    };

    const createPetFromDNA = (parentId1: bigint, parentId2: bigint, name: string) => {
        return writeContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'createFromDNA',
            args: [parentId1, parentId2, name],
            gas: 500000n,
        });
    };

    const attack = (petId: bigint, targetId: bigint) => {
        return writeContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'attack',
            args: [petId, targetId],
            gas: 300000n,
        });
    };

    const changeDna = (petId: bigint, newDna: bigint) => {
        return writeContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'changeDna',
            args: [petId, newDna],
            gas: 100000n,
        });
    };

    const transferPet = (to: string, petId: bigint) => {
        return writeContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'transferFrom',
            args: [address, to as `0x${string}`, petId],
            gas: 200000n,
        });
    };

    const getPet = (petId: bigint) => {
        return useReadContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'getById',
            args: [petId],
            query: {
                enabled: !!petId,
            },
        });
    };

    const getPetStats = (petId: bigint) => {
        return useReadContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'getStats',
            args: [petId],
            query: {
                enabled: !!petId,
            },
        });
    };

    const getBattleStats = (petId: bigint) => {
        return useReadContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'getBattleStats',
            args: [petId],
            query: {
                enabled: !!petId,
            },
        });
    };

    const getTotalPetsCount = () => {
        return useReadContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'getTotalCount',
        });
    };

    const getOwnerPetCount = (owner: string) => {
        return useReadContract({
            address: CONTRACT_ADDRESS,
            abi: ethereumAbi.abi,
            functionName: 'ownerZombieCount',
            args: [owner as `0x${string}`],
            query: {
                enabled: !!owner,
            },
        });
    };

    const isReady = (readyTime: bigint): boolean => {
        return Number(readyTime) <= Date.now() / 1000;
    };

    const getRarityColor = (rarity: number): string => {
        const colors = {
            1: '#8B4513',
            2: '#C0C0C0',
            3: '#FFD700',
            4: '#FF69B4',
            5: '#8A2BE2',
        };
        return colors[rarity as keyof typeof colors] || '#8B4513';
    };

    const getRarityName = (rarity: number): string => {
        const names = {
            1: 'Common',
            2: 'Uncommon',
            3: 'Rare',
            4: 'Epic',
            5: 'Legendary',
        };
        return names[rarity as keyof typeof names] || 'Unknown';
    };

    return {
        address,
        isConnected,

        pets,
        petIds,
        isLoading: isPetsLoading,
        contractError: petsError,

        createRandomPet,
        levelUp,
        changeName,
        battlePets,
        createPetFromDNA,
        attack,
        changeDna,
        transferPet,

        getPet,
        getPetStats,
        getBattleStats,
        getTotalPetsCount,
        getOwnerPetCount,

        hash,
        isPending,
        writeError,

        refetchPetIds,

        isReady,
        getRarityColor,
        getRarityName,
    };
};
