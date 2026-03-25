// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyNFT is ERC721, Ownable, ReentrancyGuard {

    uint256 public maxSupply = 5;
    uint256 public mintPrice = 1 ether;
    uint256 public totalSupply;

    string private baseTokenURI;

    constructor(string memory baseURI_) ERC721("MyNFT", "MNFT") {
    baseTokenURI = baseURI_;
}

    function mint(address to) external payable nonReentrant {
        require(totalSupply < maxSupply, "Max supply reached");
        require(msg.value == mintPrice, "Incorrect MATIC");

        totalSupply++;
        _safeMint(to, totalSupply);
    }

    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }
}