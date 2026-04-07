import { CONTRACT_ADDRESS, isContractConfigured } from './contractConfig';
import ethereumAbi from './contracts/ethereumAbi.json';

/** Arguments for `usePetsContract` from `@shared/core`. */
export const petsContractParams = {
    contractAddress: CONTRACT_ADDRESS,
    abi: ethereumAbi.abi as readonly unknown[],
    enabled: isContractConfigured,
} as const;
