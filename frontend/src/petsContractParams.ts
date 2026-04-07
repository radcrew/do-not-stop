import { CONTRACT_ADDRESS } from './config';
import ethereumAbi from './contracts/ethereumAbi.json';

/** Arguments for `usePetsContract` from `@shared/core`. */
export const petsContractParams = {
    contractAddress: CONTRACT_ADDRESS as `0x${string}`,
    abi: ethereumAbi.abi as readonly unknown[],
    enabled: true,
} as const;
