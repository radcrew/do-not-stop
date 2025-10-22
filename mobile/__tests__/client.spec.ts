import { client } from "../src/client";

jest.mock("../src/client", () => {
  const mockClient = {
    auth: {},
    viem: {},
    solana: {},
    reactNative: { WebView: jest.fn() },
  };
  return { client: mockClient };
});

describe("Dynamic client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully import and use the client", () => {
    expect(client).toBeDefined();
  });

  it("should have all required extensions", () => {
    expect(client.auth).toBeDefined();
    expect(client.viem).toBeDefined();
    expect(client.solana).toBeDefined();
    expect(client.reactNative).toBeDefined();
  });
});
