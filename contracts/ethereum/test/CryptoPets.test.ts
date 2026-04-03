import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("CryptoPets", async function () {
    const { viem } = await network.connect();

    it("Should set the correct name and symbol", async function () {
        const cryptoPets = await viem.deployContract("CryptoPets");

        assert.equal(await cryptoPets.read.name(), "CryptoPets");
        assert.equal(await cryptoPets.read.symbol(), "PETS");
    });

    it("Should create a pet successfully", async function () {
        const cryptoPets = await viem.deployContract("CryptoPets");
        const [owner, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet"], { account: addr1.account });

        assert.equal(await cryptoPets.read.getTotalCount(), 1n);
        assert.equal(await cryptoPets.read.balanceOf([addr1.account.address]), 1n);
        assert.equal(await cryptoPets.read.ownerPetCount([addr1.account.address]), 1n);
    });

    it("Should not allow creating multiple pets for same address", async function () {
        const cryptoPets = await viem.deployContract("CryptoPets");
        const [owner, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet1"], { account: addr1.account });

        try {
            await cryptoPets.write.createRandom(["TestPet2"], { account: addr1.account });
            assert.fail("Expected transaction to revert");
        } catch (error: any) {
            assert(error.message.includes("You already have a pet!"));
        }
    });

    it("Should return correct pet data", async function () {
        const cryptoPets = await viem.deployContract("CryptoPets");
        const [owner, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet"], { account: addr1.account });

        const pet = await cryptoPets.read.getById([1n]);

        assert.equal(pet.name, "TestPet");
        assert.equal(pet.level, 1);
        assert.equal(pet.winCount, 0);
        assert.equal(pet.lossCount, 0);
    });

    it("Should level up pet with correct fee", async function () {
        const cryptoPets = await viem.deployContract("CryptoPets");
        const [owner, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet"], { account: addr1.account });

        const levelUpFee = await cryptoPets.read.LEVEL_UP_FEE();

        await cryptoPets.write.levelUp([1n], {
            account: addr1.account,
            value: levelUpFee
        });

        const [level] = await cryptoPets.read.getStats([1n]);
        assert.equal(level, 2);
    });

    it("Should reject level up with incorrect fee", async function () {
        const cryptoPets = await viem.deployContract("CryptoPets");
        const [owner, addr1] = await viem.getWalletClients();

        await cryptoPets.write.createRandom(["TestPet"], { account: addr1.account });

        try {
            await cryptoPets.write.levelUp([1n], {
                account: addr1.account,
                value: 2000000000000000n // 0.002 ETH
            });
            assert.fail("Expected transaction to revert");
        } catch (error: any) {
            assert(error.message.includes("Incorrect fee amount"));
        }
    });
});
