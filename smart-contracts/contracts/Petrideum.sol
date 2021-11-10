// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

// import "openzeppelin/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Petrideum is ERC20 {
  function decimals() public pure override returns (uint8) {
    return 6;
  }
  constructor() ERC20("Petrideum", "PTRD") {
      _mint(msg.sender, 5 * 10**uint256(decimals()));
  }
}
