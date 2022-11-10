import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../utils/verify"
import {
    VOTING_PERIOD,
    VOTING_DELAY,
    QUORUM_PERCENTAGE,
    networkConfig,
    developmentChains,
    ADDRESS_ZERO,
} from "../helper-hardhat-config"
import { ethers } from "hardhat"

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { log } = deployments
    const { deployer } = await getNamedAccounts()
    //additionally we need the governanceToken and the timeLock contracts as well
    // we need these contracts to pass as parametres for the governor contract
    const governanceToken = await ethers.getContract("GovernanceToken", deployer)
    const timeLock = await ethers.getContract("TimeLock", deployer)
    console.log("Deploying governor")
    const governor = await ethers.getContract("GovernorContract", deployer)
    // const governor = await ethers.getContract("GovernorContract", {
    //     from: deployer,
    //     args: [
    //         governanceToken.address,
    //         timeLock.address,
    //         VOTING_DELAY,
    //         VOTING_PERIOD,
    //         QUORUM_PERCENTAGE,
    //     ],
    //     log: true,
    // })

    log("----------------------------------------------------")
    log("Setting up contracts for roles...")
    // would be great to use multicall here...
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposerTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
    // Guess what? Now, anything the timelock wants to do has to go through the governance process!
}

export default setupContracts
setupContracts.tags = ["all", "setup"]
