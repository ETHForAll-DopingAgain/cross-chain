import { create } from "@connext/sdk";
import { BigNumber } from "ethers"; 
import { signer, sdkConfig } from "./config.js";

const {sdkBase} = await create(sdkConfig);

const signerAddress = await signer.getAddress();

// xcall parameters
const originDomain = "1735353714";
const destinationDomain = "9991";
const originAsset = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const amount = "100000000000000";
const slippage = "10000";

// Estimate the relayer fee
const relayerFee = (
  await sdkBase.estimateRelayerFee({
    originDomain, 
    destinationDomain
  })
).toString();

console.log("Relayer Fee : ", relayerFee);
console.log("Signer Address : ", signerAddress);

// Prepare the xcall params
const xcallParams = {
  origin: originDomain,           // send from Goerli
  destination: destinationDomain, // to Mumbai
  to: "0x6E86B7F375Cb04B591085FD6f6bEad0B177bDfAC",              // the address that should receive the funds on destination
  asset: originAsset,             // address of the token contract
  delegate: signerAddress,        // address allowed to execute transaction on destination side in addition to relayers
  amount: amount,                 // amount of tokens to transfer
  slippage: slippage,             // the maximum amount of slippage the user will accept in BPS (e.g. 30 = 0.3%)
  callData: "0x",                 // empty calldata for a simple transfer (byte-encoded)
  relayerFee: relayerFee,         // fee paid to relayers 
};

// Approve the asset transfer if the current allowance is lower than the amount.
// Necessary because funds will first be sent to the Connext contract in xcall.
const approveTxReq = await sdkBase.approveIfNeeded(
  originDomain,
  originAsset,
  amount
)


if (approveTxReq) {
    const approveTxReceipt = await signer.sendTransaction(approveTxReq);
    await approveTxReceipt.wait();
}
console.log("Approved Transaction : ", approveTxReq)

// Send the xcall
const xcallTxReq = await sdkBase.xcall(xcallParams);
xcallTxReq.gasLimit = BigNumber.from("20000000"); 
const xcallTxReceipt = await signer.sendTransaction(xcallTxReq);
// console.log(xcallTxReceipt);
await xcallTxReceipt.wait();