// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const LockModule = buildModule("QnARewardModule", (m) => {
  const addr = "0x50585f280F9b1CaEf186eE6E9cBBAB65a5fC39Eb"; // first address in local hardhat network
  const reward = m.contract("QnAReward", [addr]);

  return { reward };
});

export default LockModule;
