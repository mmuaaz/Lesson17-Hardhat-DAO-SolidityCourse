// the code that does all the setting up
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// import verify from "../helper-functions"
import { networkConfig, developmentChains, ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { log } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await ethers.getContract("GovernanceToken", deployer)
    const timeLock = await ethers.getContract("TimeLock", deployer)
    const governor = await ethers.getContract("GovernorContract", deployer)

    log("----------------------------------------------------")
    log("Setting up contracts for roles...")

    //we wanna set the roles so that only governor can send things to the timeLock
    //timeLock can behave as the president
    //so the way its gonna work, we are gonna get the bytecode of different roles
    // when we look at the openzeppelin timeLockControler contract; we see that it is inheriting AccessControls which has these different roles; these roles
    //come as bytes 32 are the hashes of the strings; so anybody having specific bytes 32 will be possessing the relevant role that these AccessControl
    //contract is assigning them
    // deployer is the timeLock admin right after the deployement which shouldnt be the case

    // would be great to use multicall here...

    // we want to fix these roles
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address) //giving governor the role of the proposer
    //governor can tell the timeLock to do anything and then governor will wait for the timeLock to finish
    await proposerTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    //so here we are giving executorRole to nobody which means everybody
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    // right now our deployer account owns the timeLockController; now that we have given everybody access, we want to revoke the role for timeLock
    await revokeTx.wait(1)
    // Guess what? Now, anything the timelock wants to do has to go through the governance process!
    //after this runs its impossible for anyone to do anything with the timeLock without governance happening
}

export default setupContracts
setupContracts.tags = ["all", "setup"]
