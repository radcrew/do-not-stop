// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Inventory.sol";
import "./Battle.sol";
import "./Breeding.sol";
import "./Utils.sol";

/**
 * @title CryptoPets
 * @dev ERC-721 facade over Inventory, Battle, Breeding, Utils
 */
contract CryptoPets is ERC721, Ownable {
    event PetTransferred(uint256 tokenId, address from, address to);

    Inventory public inventory;
    Battle public battleLogic;
    Breeding public breeding;
    Utils public utils;

    mapping(address => uint256) public ownerPetCount;
    uint256 public constant LEVEL_UP_FEE = 0.001 ether;
    uint256 public constant NAME_CHANGE_LEVEL = 2;
    uint256 public constant DNA_CHANGE_LEVEL = 20;

    constructor() ERC721("CryptoPets", "PETS") Ownable(msg.sender) {
        inventory = new Inventory();
        utils = new Utils();
        battleLogic = new Battle(address(inventory), address(utils));
        breeding = new Breeding(address(inventory), address(utils));

        inventory.authorizeCaller(address(breeding));
        inventory.authorizeCaller(address(battleLogic));
    }

    modifier onlyPetOwner(uint256 _tokenId) {
        require(
            ownerOf(_tokenId) == msg.sender,
            "Not the owner of this pet"
        );
        _;
    }

    modifier aboveLevel(uint256 _level, uint256 _tokenId) {
        (uint32 level, , , ) = inventory.getPetStats(_tokenId);
        require(level >= _level, "Pet level too low");
        _;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);

        if (from == address(0)) {
            return super._update(to, tokenId, auth);
        }

        if (to != address(0)) {
            ownerPetCount[from]--;
            ownerPetCount[to]++;
            emit PetTransferred(tokenId, from, to);
        }

        return super._update(to, tokenId, auth);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return
            string(
                abi.encodePacked(
                    "https://api.cryptopets.io/metadata/",
                    _toString(tokenId)
                )
            );
    }

    function createRandom(string memory _name) public {
        require(ownerPetCount[msg.sender] == 0, "You already have a pet!");

        uint256 randDna = utils.generateRandomDna(_name);
        uint8 rarity = utils.calculateRarity(randDna);

        uint256 newId = inventory.createPet(_name, randDna, rarity);
        _safeMint(msg.sender, newId);
        ownerPetCount[msg.sender]++;
    }

    function attack(uint256 _petId, uint256 _targetId) public {
        battleLogic.attack(_petId, _targetId);
    }

    function createFromDNA(
        uint256 _petId1,
        uint256 _petId2,
        string memory _name
    ) public {
        breeding.breed(_petId1, _petId2, _name);

        uint256 newId = inventory.totalPets();

        _safeMint(msg.sender, newId);
        ownerPetCount[msg.sender]++;
    }

    function levelUp(uint256 _tokenId)
        public
        payable
        onlyPetOwner(_tokenId)
    {
        require(msg.value == LEVEL_UP_FEE, "Incorrect fee amount");
        inventory.levelUp(_tokenId);
    }

    function changeName(
        uint256 _tokenId,
        string memory _newName
    )
        public
        onlyPetOwner(_tokenId)
        aboveLevel(NAME_CHANGE_LEVEL, _tokenId)
    {
        inventory.changeName(_tokenId, _newName);
    }

    function changeDna(
        uint256 _tokenId,
        uint256 _newDna
    )
        public
        onlyPetOwner(_tokenId)
        aboveLevel(DNA_CHANGE_LEVEL, _tokenId)
    {
        inventory.changeDna(_tokenId, _newDna);
    }

    function getById(uint256 _tokenId)
        public
        view
        returns (Inventory.Pet memory)
    {
        return inventory.getPet(_tokenId);
    }

    function getTotalCount() public view returns (uint256) {
        return inventory.totalPets();
    }

    function getStats(
        uint256 _tokenId
    ) public view returns (uint32, uint16, uint16, uint8) {
        return inventory.getPetStats(_tokenId);
    }

    function getBattleStats(
        uint256 _tokenId
    ) public view returns (uint16, uint16, uint256) {
        return battleLogic.getBattleStats(_tokenId);
    }

    function getByOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](balanceOf(owner));
        uint256 counter = 0;

        for (uint256 i = 1; i <= getTotalCount(); i++) {
            if (_ownerOf(i) == owner) {
                result[counter] = i;
                counter++;
            }
        }

        return result;
    }

    function battle(uint256 _id1, uint256 _id2) public {
        battleLogic.fight(_id1, _id2);
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function _toString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
