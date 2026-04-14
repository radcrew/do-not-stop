import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/** Local Hardhat: VRF mock + CryptoPets with native-funded subscription */
const CryptoPetsModule = buildModule("CryptoPetsModule", (m) => {
    const localDeployer = m.contract("LocalCryptoPetsDeployer", [], {
        value: 100_000_000_000_000_000_000n,
    });

    return { localDeployer };
});

export default CryptoPetsModule;
