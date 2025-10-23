import React from "react";
import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";
import { SolanaExtension } from "@dynamic-labs/solana-extension";
import { DynamicContextProvider } from "@dynamic-labs/react-hooks";
import { DYNAMIC_CONFIG } from "../config/dynamic";

interface DynamicProviderProps {
  children: React.ReactNode;
}

// Create Dynamic client with React Native extensions - following official docs
export const dynamicClient = createClient({
  // Find your environment id at https://app.dynamic.xyz/dashboard/developer
  environmentId: DYNAMIC_CONFIG.environmentId,
  // Optional:
  appLogoUrl: DYNAMIC_CONFIG.appLogoUrl,
  appName: DYNAMIC_CONFIG.appName,
})
  .extend(ReactNativeExtension())
  .extend(ViemExtension())
  .extend(SolanaExtension());

export const DynamicProvider: React.FC<DynamicProviderProps> = ({
  children,
}) => {
  return (
    <DynamicContextProvider client={dynamicClient}>
      {children}
    </DynamicContextProvider>
  );
};

export default DynamicProvider;
