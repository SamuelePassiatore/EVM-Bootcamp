import express from "express";
import { generateSiweNonce } from "viem/siwe";
import {
  /* verifySignature, */
  getAddressFromMessage,
  getChainIdFromMessage,
} from "@reown/appkit-siwe";
import { createPublicClient, getAddress, http } from "viem";
import { reownProjectId } from "../constants";
import { API } from "../shared/endpoints";
import User from "../schema/user";

const router = express.Router();

declare module "express-session" {
  interface SessionData {
    siwe: null | { address: string; chainId: number; userId?: string };
    nonce: null | string;
  }
}

// generate a nonce
router.get(API.auth.routes.GET_NONCE, function (_, res) {
  res.setHeader("Content-Type", "text/plain");
  console.log("/nonce");
  res.send(generateSiweNonce());
});

// verify the message
router.post(API.auth.routes.VERIFY, async (req, res) => {
  try {
    if (!req.body.message) {
      res.status(400).json({ error: "SiweMessage is undefined" });
    }
    const message = req.body.message;

    const address = getAddressFromMessage(message);
    let chainId = getChainIdFromMessage(message);
    const projectId = reownProjectId;

    // for the moment, the verifySignature is not working with social logins and emails  with non deployed smart accounts
    /*       const isValid = await verifySignature({
        address,
        message,
        signature: req.body.signature,
        chainId,
        projectId,
      }); */
    // we are going to use https://viem.sh/docs/actions/public/verifyMessage.html
    const publicClient = createPublicClient({
      transport: http(
        `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`,
      ),
    });
    if (chainId.includes(":")) {
      chainId = chainId.split(":")[1];
    }
    // Convert chainId to a number
    const chainIdNum = Number(chainId);
    const isValid = await publicClient.verifyMessage({
      message,
      address: getAddress(address, chainIdNum),
      signature: req.body.signature,
    });
    // end o view verifyMessage

    if (!isValid) {
      // throw an error if the signature is invalid
      throw new Error("Invalid signature");
    }

    if (isNaN(chainIdNum)) {
      throw new Error("Invalid chainId");
    }

    try {
      let user = await User.findOne({ walletAddress: address });
      
      if (!user) {
        user = new User({
          walletAddress: address,
          createdAt: new Date()
        });
        await user.save();
        console.log(`New user created with wallet: ${address}`);
      }
      
      req.session.siwe = { address, chainId: chainIdNum, userId: user._id.toString() };
      req.session.save(() => res.status(200).send(true));
    } catch (error) {
      console.error("Error creating/finding user:", error);
      req.session.siwe = null;
      req.session.nonce = null;
      req.session.save(() => res.status(500).json({ message: "Error processing user data" }));
    }
  } catch (e: unknown) {
    // clean the session
    req.session.siwe = null;
    req.session.nonce = null;
    
    const errorMessage = e instanceof Error ? e.message : 'Errore sconosciuto';
    req.session.save(() => res.status(500).json({ message: errorMessage }));
  }
});

// get the session
router.get(API.auth.routes.GET_SESSION, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log("/session", req.session.siwe);

  res.send(req.session.siwe);
});

// signout and clean the session
router.get(API.auth.routes.SIGNOUT, (req, res) => {
  req.session.siwe = null;
  req.session.nonce = null;
  console.log("/singout");
  req.session.save(() => res.send({}));
});

export { router };