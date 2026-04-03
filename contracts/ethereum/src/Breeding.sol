// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Inventory.sol";
import "./Utils.sol";

/**
 * @title Breeding
 * @dev Parents must be ready; creates child in Inventory
 */
contract Breeding {
    event Bred(uint256 parentId1, uint256 parentId2, uint256 childId);

    Inventory public inventory;
    Utils public utils;

    constructor(address _inventory, address _utils) {
        inventory = Inventory(_inventory);
        utils = Utils(_utils);
    }

    function breed(
        uint256 _petId1,
        uint256 _petId2,
        string memory _name
    ) external {
        require(
            _petId1 > 0 && _petId1 <= inventory.totalPets(),
            "First pet doesn't exist"
        );
        require(
            _petId2 > 0 && _petId2 <= inventory.totalPets(),
            "Second pet doesn't exist"
        );
        require(_petId1 != _petId2, "Can't breed with self");

        require(inventory.isReady(_petId1), "First parent not ready");
        require(inventory.isReady(_petId2), "Second parent not ready");

        Inventory.Pet memory p1 = inventory.getPet(_petId1);
        Inventory.Pet memory p2 = inventory.getPet(_petId2);

        uint256 newDna = mixDna(p1.dna, p2.dna);
        uint8 rarity = utils.calculateRarity(newDna);

        uint256 childId = inventory.createPet(_name, newDna, rarity);

        inventory.triggerCooldown(_petId1);
        inventory.triggerCooldown(_petId2);

        emit Bred(_petId1, _petId2, childId);
    }

    function mixDna(
        uint256 _dna1,
        uint256 _dna2
    ) public view returns (uint256) {
        uint256 rand = uint256(
            keccak256(abi.encodePacked(block.timestamp, _dna1, _dna2))
        );
        return rand % (10 ** 16);
    }
}
