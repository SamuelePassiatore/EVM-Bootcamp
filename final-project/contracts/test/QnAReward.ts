import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("QnAReward", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const reward = await hre.viem.deployContract("QnAReward", [
      owner.account.address,
    ]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      reward,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { reward, owner } = await loadFixture(deployFixture);

      expect((await reward.read.owner()).toLowerCase()).to.equal(
        owner.account.address,
      );
    });
    it("Should able to create reward", async function () {
      const { reward, owner, otherAccount, publicClient } =
        await loadFixture(deployFixture);

      const trxHash = await reward.write.safeMint([
        otherAccount.account.address,
        "www.google.com",
      ]);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: trxHash,
      });
      const trx = await publicClient.getTransaction({ hash: trxHash });

      const rewardOwner = await reward.read.ownerOf([trx.value]);

      expect(rewardOwner.toLowerCase()).to.eq(otherAccount.account.address);
    });
  });
});
