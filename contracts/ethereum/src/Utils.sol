// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Utils
 * @dev Randomness, DNA, and rarity helpers
 */
contract Utils {
    uint256 public constant DNA_DIGITS = 16;
    uint256 public constant DNA_MODULUS = 10 ** DNA_DIGITS;

    uint256 private randNonce = 0;

    function generateRandomDna(
        string memory _name
    ) external view returns (uint256) {
        uint256 rand = uint256(
            keccak256(
                abi.encodePacked(_name, block.timestamp, block.prevrandao)
            )
        );
        return rand % DNA_MODULUS;
    }

    function calculateRarity(uint256 _dna) external pure returns (uint8) {
        uint256 rarityScore = _dna % 100;
        if (rarityScore < 50) return 1;
        if (rarityScore < 75) return 2;
        if (rarityScore < 90) return 3;
        if (rarityScore < 98) return 4;
        return 5;
    }

    function randMod(uint256 _modulus) external returns (uint256) {
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % _modulus;
    }

    function mixDna(
        uint256 _dna1,
        uint256 _dna2
    ) external view returns (uint256) {
        uint256 rand = uint256(
            keccak256(abi.encodePacked(block.timestamp, _dna1, _dna2))
        );
        return rand % DNA_MODULUS;
    }
}
