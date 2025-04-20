// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const LockModule = buildModule("QnARewardModule", (m) => {
  const addr = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // first address in local hardhat network
  const reward = m.contract("QnAReward", [addr]);

  return { reward };
});

export default LockModule;
