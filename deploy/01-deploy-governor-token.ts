import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
//The above two functions are the main things we need to create a deploy function
//import { verify } from "../utils/verify"
//import { networkConfig, developmentChains } from "../helper-hardhat-config"
import { ethers } from "hardhat"

// creating a deployFunction; now the syntax is in the below format:
// name of the deployfunction that we give it: type of the variable = (parameters)
// you can rename the parametres like we did with "HardhatRuntimeEnvironment"
const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    //so when we run hardhat deploy; we are passing our fake hardhat chain that we are running in the background
    const { getNamedAccounts, deployments, network } = hre // we are getting these from hre which is getting updated from hardhat deploy
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------------------------------------")
    log("Deploying GovernanceToken and waiting for confirmations...")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // we need to wait if on a live network so we can verify properly
        //   waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })

    //Verify
    // log(`GovernanceToken at ${governanceToken.address}`)
    // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    //     await verify(governanceToken.address, [])
    // }
    log(`Delegating to ${deployer}`)
    await delegate(governanceToken.address, deployer)
    log("Delegated!")
}

//when you deploy this SC, nobody has voting power yet; so we have to delegate this token to our deployer

//so basically this delegate function is using for allowing the users to vote on behalf of the deployer; so the deployer is saying hey take my votes
const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const transactionResponse = await governanceToken.delegate(delegatedAccount)
    await transactionResponse.wait(1)
    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
    //checkPoints
    //anytime you call delegate function; you also call the function moveVotingPower which happens at the backend which writes the checkpoints
    //this checkpoint writing is gonna take a note that at checkpoints-x this much of voting power each of these accounts has
    //so its not the block but every checkpoints that the voting power is noted as its much cheaper than doing this blockwise
}

export default deployGovernanceToken
deployGovernanceToken.tags = ["all", "governor"]
