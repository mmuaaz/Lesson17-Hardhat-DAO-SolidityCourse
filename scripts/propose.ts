import { ethers, network } from "hardhat"
import {
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
    FUNC,
    PROPOSAL_DESCRIPTION,
    NEW_STORE_VALUE,
} from "../helper-hardhat-config"
import * as fs from "fs"
import { moveBlocks } from "../utils/move-blocks"

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    //in the governance contract and the propose function, it has 4 params;
    // 1. targets: we pick a list of targets > just our box contracts > the target are the contracts that we want to call functions on
    // 2. Values: how much ETH you wanna send > no eth we sending
    // 3. bytes array calldata: encoded params for the function that we wanna call
    // 4. Description: as it is

    // we have to encode all function params that we are calling in box contract because we are updating the box contract with a new value;
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args) //this will return a really long encoded string
    //encoding proposal tx
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description:\n  ${proposalDescription}`)
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )
    // If working on a development chain, we will push forward till we get to the voting period.
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }
    //we need that proposalId it is emiting in an event so for this we make arrangements in the code:
    const proposeReceipt = await proposeTx.wait(1)
    // getting those event from this proposeReceipt
    const proposalId = proposeReceipt.events[0].args.proposalId
    // we have some checkpoints stuff that we can refer to github repo Patrick said this,
    // couldnt understand what he is referring to
    //but i have copied the code from his repo the 4 lines are for snapshots that he referred to are below
    console.log(`Proposed with proposal ID:\n  ${proposalId}`)

    const proposalState = await governor.state(proposalId)
    const proposalSnapShot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)
    // save the proposalId
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))

    // The state of the proposal. 1 is not passed. 0 is passed.
    console.log(`Current Proposal State: ${proposalState}`)
    // What block # the proposal was snapshot
    console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
    // The block number the proposal voting expires
    console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION) //coming from helper-hardhat.config
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
