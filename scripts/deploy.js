const { ethers, run, network } = require("hardhat")

async function main() {
    const simpleStorageContractFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying Contract...")
    const simpleStorageContract = await simpleStorageContractFactory.deploy()
    await simpleStorageContract.deployed()
    console.log(`Deployed contract to: ${simpleStorageContract.address}`)
    // if on rinkeby network and ETHERSCAN_API_KEY exists
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorageContract.deployTransaction.wait(6)
        await verify(simpleStorageContract.address, [])
    }

    const currentValue = await simpleStorageContract.retrieve()
    console.log(`Current Value: ${currentValue.toString()}`)

    const txResponse = await simpleStorageContract.store("65")
    await txResponse.wait(1)

    const updatedValue = await simpleStorageContract.retrieve()
    console.log(`Updated Value: ${updatedValue.toString()}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified")
        } else {
            console.log(error)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
