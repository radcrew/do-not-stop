import React from 'react';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { DYNAMIC_CONFIG } from '../config/dynamic';

interface DynamicProviderProps {
    children: React.ReactNode;
}

export const DynamicProvider: React.FC<DynamicProviderProps> = ({ children }) => {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: DYNAMIC_CONFIG.environmentId,
                walletConnectors: [EthereumWalletConnectors],
                overrides: {
                    evmNetworks: DYNAMIC_CONFIG.evmNetworks,
                },
                initialAuthenticationMode: DYNAMIC_CONFIG.initialAuthenticationMode,
                appName: DYNAMIC_CONFIG.appName,
                appLogoUrl: DYNAMIC_CONFIG.appLogoUrl,
            }}
        >
            <DynamicWagmiConnector>
                {children}
            </DynamicWagmiConnector>
        </DynamicContextProvider>
    );
};

export default DynamicProvider;

