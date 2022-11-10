;/===============================DAOs================ /
;/Definition/ // Any group that is governed by a transparent set of rules found on a BC or SC

// some say BTC is DAO because miners can choose whether to upgrade their software
// DAOs must use SC so that they rules engrained in them

// the first DAO in 2016 which had hack of almost 50Bil USD showing it to be too human, largest hack at that time

// voting is what used to operate DAOs, and can be referred to as Decentralized Governance: company/Org operated exclusively through code

// COMPOUND DAO: >>>> The reason that we are actually doing it like in an encoded way is that(proposal and governance process) these contracts likely have access
// controls where actually the owner of these contracts can call these functions while the owner of these SCs likely going to be governance DAO; values 0 means we are
// not sending any ETH along with these txs
// compound governance tx > succeeded tx > governance contract > write as proxy

// sometimes these proposals are not very straighforward that you want yes or no vote for it; sometimes proposals want opinion like discussion forum; usually discords
// are where people discuss about these proposals
// Snapshots might be one of the tools that we can use to figure out if the community wants something before it even goes to vote; so you can join these and vote with
// the token to actually see the sentiments of the community

// ok so voting can be done by lot of ways;
// allowing ERC-20 tokens to allow people to vote
// allowing NFTs to vote
// allowing only per person votes >>> sybil resistance problem

// on chain voting Vs off-chain voting:

// allowing sending a tx to vote >>>>  costs a lot of gas >>> Governor

// Governor C: the use of random sampling to do some quadratic voting to help reduce costs while increasing sybil resistance

// You can still vote Off-chain in a decentralized context::: just sign a tx without sending the tx on-chain and without spending any gas>>>>
// You can sign the tx and record you votes to IPFS and then compile the results > send the results of the voting through chainLink Oracle	to the bC all in a single tx

// YOu can do is replay all these sign tx in a single tx to save gas this will reduce the voting cost to 99%
// Now this is an implementation and one of the most popular ways to do this is through snapshot which awaits for chainLInk Integration

// There are no codes solution to implementing this voting solution into your DAOs:> DaoStack : Aragon : Colony : DAO house
// in the end SnapShot is the one of the most popular tools for getting the sentiment of the DAO and performing that execution
// People can vote using their tokens the DAO gets to see the voting of the community and the voting resutls gets saved to IPFS but none of it gets executed unless if DAO
// chooses to
// You can send the tx and execute them as well
// ZODIAC is a suite based of database tools for us to implement into our DAOs as well
// Tally is one of these UIs that we can use to built on top of our DAOs for people to see what goes behind these SC through a UI
// Gnosis SAFE Multisig: is a multi sig wallet   >>> all of these adds centrality component to the DAO
// Openzapellin also offers fantastic range of solutions for implementing the DAOs through SC
// legally a DAO can be recognised in the US state of Wyoming
;/ =------------------------Building a DAO:/

// using Hardhat, solidity and openzappelin contracts to build a DAO through a ERC-20 token and NFT token voting mechanism
// we are going to be building a very simple SC that has only 1 function called store that can be called by only the owner of the SC, but the owner is going to be the DAO
//this is going to be on-chain DAO, so the gas fee will be factor in the voitng
// we are going to build a DAO where users be able to vote for a change in the store function, while voting can be recorded, queued, and executed to change the function
;/starting the project/
//1. install dependencies > yarn add --dev hardhat > yarn add --dev @openzeppelin/contracts
// 2. instaled solidity extension fro Juan Blanco
// 3. ;/copied Box.sol from the git repo of the course
//4. creating Governance.sol SC
//5. created "governance_standard" folder > this is going to be standard governances model; this is going to be on-chain ERC20; which Patrick said plan on updating in the
// future to off-chain
//6. created a folder inside "contracts" folder; which is step 5, and the contracts are moved to the governance_standard folder; while we create 2 more SC, GovernorContract.sol
//  and TimeLock.sol
// GovernorContract.sol// this is going to be the contract that has all the voting code, all the voting logic that our governance token is going to use
// TimeLock.sol //This SC is going to be is going to be the additional contract that is an owner of the box.sol contract; this is important because when we finish voting and the
//porposal is approved/queued, we want to wait for the new votes to be executed
// Lets some proposal goes through thats bad; we have a box Contract and the proposal goes through that says that everyone who wants to participate in the votes should pay 5 votes
//may be users dont want to be a part of this voting then all of these governance contracts give time for the users to get out of this if they dont like the governance update; once the
//proposal passes, it doesnt go in effect immediately; we have to wait some duration
;/openzeppelin contracts wizard/ //https://docs.openzeppelin.com/contracts/4.x/wizard
//is a way to create a really basic boilerplate right in the wizard
//so you can actually go there and choose "governor" select parametres and you will have the contract written for those specific paramteres
;/hardhat deploy / //https://github.com/wighawag/hardhat-deploy
//RUN COMM: yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
// RUN COMM: yarn add --dev hardhat-deploy

// what we will be doing now, instead of having to write scripts; we will create a "deploy" folder where we will add all our deploy scripts
// we need to change our hardhat.config to typescript

// RUN COMM: yarn add --dev typescript typechain ts-node @typechain/ethers-v5 @typechain/hardhat @types/chai @types/node

//GovernorContract:     Everybody votes using tokens and voting power
//TimeLock: governorContracts asks timeLock to propose the resolution; timeLock waits a certain "minDelay"; once this delay is done, anybody can execute
;/chainlink keepers/ //as the timeLock is waiting we can integerate chainLink keepers to wait that certain delay but this is not done in this project

//after writing deploy scripts for all of our contracts, we write scipts to interact with our contracts; these are usually doing the work of a frontend if there was;
//or we can do the integration with snapshot or tally
