// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Wallet {
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event Withdraw(address indexed to, uint256 amount, uint256 balance);
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 balance
    );

    bool internal locked;
    address public owner = msg.sender;
    // address[] tokens;
    // mapping(address => bool) tokens;

    mapping(address => uint256) userEtherBalance; // user address => ether amount
    mapping(address => mapping(address => uint256)) userTokenBalance; // user address => token address => amount

    modifier onlyOwner() {
        require(owner == msg.sender, "Not owner");
        _;
    }

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    receive() external payable {
        userEtherBalance[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    fallback() external payable {
        userEtherBalance[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function etherBalance() external view returns (uint256) {
        return userEtherBalance[msg.sender];
    }

    function etherBalanceOf(address user) external view returns (uint256) {
        return userEtherBalance[user];
    }

    function totalEtherBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withraw(uint256 amount) external returns (uint256) {
        require(amount <= address(this).balance, "Not enough ether balance");
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to withdraw Ether");
        emit Withdraw(msg.sender, amount, address(this).balance);
        return amount;
    }

    function transfer(address to, uint256 amount) external returns (uint256) {
        require(amount <= address(this).balance, "Not enough ether balance");
        (bool success, ) = to.call{value: amount}("");
        require(success, "Failed to send Ether");
        emit Transfer(msg.sender, to, amount, address(this).balance);
        return amount;
    }

    // ERC20

    function getTokenBalance(address tokenAddress)
        public
        view
        returns (uint256)
    {
        return userTokenBalance[msg.sender][tokenAddress];

        // ERC20 tokenContract = ERC20(tokenAddress);
        // return tokenContract.balanceOf(address(this));

        // (bool success, bytes memory result) = tokenAddress.delegatecall(
        //     abi.encodeWithSignature("balanceOf(address)", msg.sender)
        // );
    }

    // WIP
    function depositToken(address tokenAddress, uint256 amount)
        public
        returns (uint256)
    {
        // o xristis tha kanei approve kai edw tha kanoume trander kai update to userTokenBalance
    }

    function withdrawToken(address tokenAddress, uint256 amount)
        public
        returns (uint256)
    {
        uint256 tokenBalance = getTokenBalance(tokenAddress);
        require(amount <= tokenBalance, "Not enough token balance");

        ERC20 tokenContract = ERC20(tokenAddress);
        tokenContract.transfer(msg.sender, amount);

        userTokenBalance[msg.sender][tokenAddress] -= amount;

        return amount;
    }

    function transferToken(
        address tokenAddress,
        address to,
        uint256 amount
    ) public returns (uint256) {
        uint256 tokenBalance = getTokenBalance(tokenAddress);
        require(amount <= tokenBalance, "Not enough token balance");

        ERC20 tokenContract = ERC20(tokenAddress);
        tokenContract.transfer(to, amount);

        userTokenBalance[msg.sender][tokenAddress] -= amount;

        return amount;
    }

    function depositToken() public {
        // delegated transfer ????
    }

    // TESTS BELOW
    /*
    
    function addToken(address newToken) public returns(address) {
        // require(!tokens[newToken].exists, "Token already exists.");
        // tokens.push(newToken);
        // return newToken;
    }
    
    function getTokenBalance(address tokenAddress) public view returns(uint) {
        ERC20 tokenContract = ERC20(tokenAddress);
        return tokenContract.balanceOf(msg.sender);
    }
    
    function depositToken() public {
        // delegated transfer
    }
    
    function withrawToken() public {
        
    }
    
    function transferToken() public {
        
    }
    */
}
