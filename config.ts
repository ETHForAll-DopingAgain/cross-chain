import { SdkConfig } from "@connext/sdk";
import { ethers } from "ethers"

// Create a Signer and connect it to a Provider on the sending chain
const privateKey = "<PRIVATE_KEY>";

let signer = new ethers.Wallet(privateKey);

// https://rpc-mumbai.matic.today/
// https://rpc-mumbai.maticvigil.com/
// https://polygon-mumbai.g.alchemy.com/v2/lSJU-c2A5VlfTX0jbyXm8sz_4j_76tK5
// Use the RPC url for the origin chain
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli");
signer = signer.connect(provider);
const signerAddress = await signer.getAddress();

const sdkConfig: SdkConfig = {
  signerAddress: signerAddress,
  // Use `mainnet` when you're ready...
  network: "testnet",
  // Add more chains here! Use mainnet domains if `network: mainnet`.
  // This information can be found at https://docs.connext.network/resources/supported-chains
  chains: {
    1735353714: { // Goerli domain ID
      providers: ["https://rpc.ankr.com/eth_goerli"],
    },
    9991: { // Optimism-Goerli domain ID
      providers: ["https://polygon-mumbai.g.alchemy.com/v2/lSJU-c2A5VlfTX0jbyXm8sz_4j_76tK5"],
    }
  },
};

export { signer, sdkConfig };