//SPDX-License-Identifier: MIT
// we are going to create it as a normal ERC-20 token and later we will add the ability for this to be Governanceable

//https://docs.openzeppelin.com/contracts/4.x/wizard
//is a way to create a really basic boilerplate right in the wizard
//so you can actually go there and choose "governor" select parametres and you will have the contract written for those specific paramteres
//voting delay: the delay between creating the proposal and the voting starts
//voting period: how long the voting is going to last
//proposal threshold: if you want to have specific number of tokens that you want a user to have in order to qualify for voting
//quorum %: what percentage of people need to vote
//bravo compatible: is the compound type contract; if you want you contracts to be integratable with compound,
// timelock: we used openzeppelin implementation of the timelock; you can use compound implementation as well
// Not working with "upgradibility" in this project
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes {
    uint256 public s_maxSupply = 1000000000000000000000000;

    constructor() ERC20("GovernanceToken", "GT") ERC20Permit("GovernanceToken") {
        _mint(msg.sender, s_maxSupply); // two constructors: 1. ERC20,  2. ERC20Permt
    }

    // Without the ERC20Permit bit of the code in the above constructor, you are done with a normal ERC-20 token; but we have to create this to a governance token
    //so that its fair to vote
    // so we want to avoid the pump and dump as it can happen that some whale will buy a ton and after the votes are over, they dump it
    // SNAPSHOT of tokens people have at a certain block
    //that way we can use the snapshot of the people actually voting so that they dont after the voting is over  >>>> for this we inherited ERC20Votes SC instead of normal ERC20
    //SC from openzeppelin

    // The functions below are overrides required by Solidity.

    function _afterTokenTransfer(
        //anytime we do this afterTokenTransfer, anytime we transfer a token we want to make sure that we call the after token transfer
        //of the ERC20votes and the reason, we want to make sure that snapshots are updated// how many tokens people have at each block
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}
