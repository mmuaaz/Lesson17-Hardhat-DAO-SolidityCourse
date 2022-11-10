import * as fs from "fs"
import { network, ethers } from "hardhat"
import { proposalsFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"

// so we are gonna get that 0th index the first index in our proposals.json; offcourse if you want to run on another network you're gonna want to add
//a "if then" condition
const index = 0

async function main(proposalIndex: number) {
    // we are calling this function main because this vote function is little bit different
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    // You could swap this out for the ID you want to use too
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    // so governor contract has functions to cast votes: you can simply cast vote, cast vote with reasons, and cast vote with sig
    //so the last one cast vote with sig: anyone could then execute this vote on behalf of us if we didnt send the tx: this method implements a meta-tx
    // and allows a project to subsidize voting fees; voters can generate a signature for free, and the project can then submit those and pay for the gas
    //this function allows that snapshot and chainlink integration: we didnt implement this integration

    // 0 = Against, 1 = For, 2 = Abstain for this example
    const voteWay = 1
    const reason = "I lika do da cha cha"
    await vote(proposalId, voteWay, reason)
}
// we can also implement to check for the state of the proposal; we did check for the state down there

// 0 = Against, 1 = For, 2 = Abstain for this example
export async function vote(proposalId: string, voteWay: number, reason: string) {
    console.log("Voting...")
    const governor = await ethers.getContract("GovernorContract")
    const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
    const voteTxReceipt = await voteTx.wait(1)
    console.log(voteTxReceipt.events[0].args.reason)
    const proposalState = await governor.state(proposalId) ///the reason we check for the state is that there is a function in the governor contract
    //so when we deploy vote.ts; we get "succeeded" state; which is at 4
    console.log(`Current Proposal State: ${proposalState}`)
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
