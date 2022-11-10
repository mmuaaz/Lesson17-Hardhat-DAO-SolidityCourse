// SPDX-License-Identifier: MIT

//This SC is going to be is going to be the additional contract that is an owner of the box.sol contract; this is important because when we finish voting
//and the porposal is approved/queued, we want to wait for the new votes to be executed Lets some proposal goes through thats bad; we have a box
// Contract and the proposal goes through that says that everyone who wants to participate in the votes should pay 5 votes may be users dont want to
// be a part of this voting then all of these governance contracts give time for the users to get out of this if they dont like the governance update; once
//the proposal passes, it doesnt go in effect immediately; we have to wait some duration

pragma solidity ^0.8.0;
// so we are going to import openzeppelin contract which has all the functionality that makes sure that our governance contract doesnt just push proposals
import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    // minDelay is how long you have to wait before executing; once proposal passes we gotta wait for this minimum Delay
    // proposers is the list of addresses that can propose: for us everyone's is gonna be able to propose
    // executors is the list of addresses that can execute; who can execute once the proposal passes
    constructor(
        uint256 minDelay,
        address[] memory proposers, //we want to only allow for the proposer to be the governor
        //the governor contract should be the only one that proposes things the TimeLock
        // the way we are working this is: governance contract proposes something to the timeLock; once its in the timeLock and it awaits that period,
        // anybody can go ahead and execute it
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
} //there are roles that comes in the openzeppelin contract of the timeLockController.sol
//we wanna set the roles so that only governor can send things to the timeLock
//timeLock can behave as the president
//so the way its gonna work, we are gonna get the bytecode of different roles
// when we look at the openzeppelin timeLockControler contract; we see that it is inheriting AccessControls which has these different roles; these roles
//come as bytes 32 are the hashes of the strings; so anybody having specific bytes 32 will be possessing the relevant role that these AccessControl
//contract is assigning them
// deployer is the timeLock admin right after the deployement which shouldnt be the case
