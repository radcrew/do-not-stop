import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Sepolia / production VRF: set parameters before deploy, e.g.
 * `pnpm hh ignition deploy ignition/modules/CryptoPetsSepolia.ts --network sepolia --parameters '{"CryptoPetsSepolia":{"vrfSubscriptionId":"…","vrfKeyHash":"0x…","vrfCoordinator":"0x…","vrfNativePayment":"false"}}'`
 */
const CryptoPetsSepoliaModule = buildModule("CryptoPetsSepolia", (m) => {
    const vrfSubscriptionId = m.getParameter("vrfSubscriptionId");
    const vrfKeyHash = m.getParameter("vrfKeyHash");
    const vrfCoordinator = m.getParameter("vrfCoordinator");
    const vrfNativePayment = m.getParameter("vrfNativePayment", false);

    const cryptoPets = m.contract("CryptoPets", [
        vrfSubscriptionId,
        vrfKeyHash,
        vrfCoordinator,
        vrfNativePayment,
    ]);

    return { cryptoPets };
});

export default CryptoPetsSepoliaModule;
