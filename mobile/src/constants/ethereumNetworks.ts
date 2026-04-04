import type { Chain } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import { hardhatLocal } from '../ethereumChains';

/** Display metadata aligned with `frontend/src/constants/chains/ethereum.ts`. */
export type EvmNetworkOption = {
    chain: Chain;
    name: string;
    symbol: string;
    isTestnet: boolean;
};

/** Networks exposed in AppKit / wagmi — same three as in `AppKitConfig`. */
export const EVM_SWITCHER_CHAINS: EvmNetworkOption[] = [
    { chain: hardhatLocal, name: 'Hardhat Local', symbol: 'ETH', isTestnet: true },
    { chain: mainnet, name: 'Ethereum', symbol: 'ETH', isTestnet: false },
    { chain: sepolia, name: 'Sepolia', symbol: 'ETH', isTestnet: true },
];

export function getEvmSwitcherChains(showTestnets: boolean): EvmNetworkOption[] {
    return EVM_SWITCHER_CHAINS.filter((c) => (showTestnets ? c.isTestnet : !c.isTestnet));
}

export function getEvmNetworkMeta(chainId: number): EvmNetworkOption | undefined {
    return EVM_SWITCHER_CHAINS.find((c) => c.chain.id === chainId);
}
