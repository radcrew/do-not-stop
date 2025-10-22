jest.mock("react-native-webview", () => {
  const { View } = require("react-native");

  const WebView = (props: { [key: string]: any }): React.ReactElement => {
    return View(props);
  };
  WebView.propTypes = { ...View.propTypes };
  return WebView;
});

jest.mock("expo-linking", () => {
  const module: typeof import("expo-linking") = {
    ...jest.requireActual("expo-linking"),
    createURL: jest.fn(),
  };

  return module;
});

jest.mock("@dynamic-labs/client", () => ({
  createClient: jest.fn().mockReturnValue({
    extend: jest.fn(function (extension) {
      Object.keys(extension).forEach((key) => {
        this[key] = extension[key];
      });

      return this;
    }),
    auth: {},
    viem: {},
    reactNative: { WebView: jest.fn() },
  }),
}));

jest.mock("@dynamic-labs/solana-extension", () => ({
  SolanaExtension: jest.fn().mockReturnValue({
    name: "solana",
    initialize: jest.fn(),
    solana: {},
  }),
}));

jest.mock("@dynamic-labs/viem-extension", () => ({
  ViemExtension: jest.fn().mockReturnValue({
    name: "viem",
    initialize: jest.fn(),
    viem: {},
  }),
}));

jest.mock("@dynamic-labs/zerodev-extension", () => ({
  ZeroDevExtension: jest.fn().mockReturnValue({
    name: "zerodev",
    initialize: jest.fn(),
    zerodev: {},
  }),
}));

jest.mock("@dynamic-labs/react-native-extension", () => ({
  ReactNativeExtension: jest.fn().mockReturnValue({
    name: "reactNative",
    initialize: jest.fn(),
    reactNative: { WebView: jest.fn() },
  }),
}));

jest.useFakeTimers();
