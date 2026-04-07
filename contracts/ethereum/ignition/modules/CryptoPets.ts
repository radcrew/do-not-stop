import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CryptoPetsModule = buildModule("CryptoPetsModule", (m) => {
    const cryptoPets = m.contract("CryptoPets", []);

    return { cryptoPets };
});

export default CryptoPetsModule;
