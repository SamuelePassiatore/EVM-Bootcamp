import password from "@inquirer/password";
import { config } from "dotenv";
import { Wallet } from "ethers";
config();

async function main() {
  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;

  if (!encryptedKey) {
    console.log("🚫️ You don't have a deployer account. Run `yarn generate` or `yarn account:import` first");
    return;
  }

  const pass = await password({ message: "Enter password to decrypt private key:" });

  const wallet = await Wallet.fromEncryptedJson(encryptedKey, pass);
  console.log(wallet.privateKey);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
