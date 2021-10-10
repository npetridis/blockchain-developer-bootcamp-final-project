// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

// import "openzeppelin/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Petridereum is ERC20 {
    constructor() ERC20("Petridereum", "PTRD") {
        _mint(msg.sender, 100 * 10**uint256(decimals()));
    }
}
