import { createClient } from "@dynamic-labs/client";
import { ReactNativeExtension } from "@dynamic-labs/react-native-extension";
import { ViemExtension } from "@dynamic-labs/viem-extension";
import { ZeroDevExtension } from "@dynamic-labs/zerodev-extension";
import { SolanaExtension } from "@dynamic-labs/solana-extension";

const environmentId =
  (process.env.EXPO_PUBLIC_ENVIRONMENT_ID as string) ||
  "eba2bd12-09b3-4c4d-ba16-4727c3c89a49";

if (!environmentId) {
  throw new Error("EXPO_PUBLIC_ENVIRONMENT_ID is required");
}

// Leave this undefined to use the default dynamic api base url
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const client = createClient({
  environmentId,
  apiBaseUrl,
  appLogoUrl: "https://demo.dynamic.xyz/favicon-32x32.png",
  appName: "Dynamic Demo",
})
  .extend(ReactNativeExtension())
  .extend(ViemExtension())
  .extend(ZeroDevExtension())
  .extend(SolanaExtension());
