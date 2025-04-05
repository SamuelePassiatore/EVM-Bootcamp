"use client";

import { useCallback } from "react";
import { abi } from "../../../artifacts/contracts/LotteryToken.sol/LotteryToken.json";
import { SharedProps } from "../utils";
import BuyLotteryToken from "./BuyLotteryToken";
import { createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const MAXUINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

const Lottery: React.FC<SharedProps> = ({ address }: SharedProps) => {
  const { data: lotteryContract } = useScaffoldContract({
    contractName: "Lottery",
  });
  const { data: prize } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "prize",
    args: [address],
  });
  const { data: betsOpen } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "betsOpen",
  });
  const { data: betPrice } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "betPrice",
  });
  const { data: betFee } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "betFee",
  });
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Lottery",
  });

  const handleBet = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_TOKEN_ADDRESS) {
      throw new Error("NEXT_PUBLIC_TOKEN_ADDRESS is not defined");
    }
    const walletClient = createWalletClient({
      chain: hardhat,
      transport: http(),
    });
    if (betFee && betPrice) {
      await walletClient.writeContract({
        account: address,
        address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
        functionName: "approve",
        abi: abi,
        args: [lotteryContract?.address, MAXUINT256],
      });
    } else {
      throw new Error("Bet fee or price is not available");
    }

    await writeContractAsync({
      functionName: "bet",
    });
  }, [address, writeContractAsync, betFee, betPrice, lotteryContract]);

  const handleCloseLottery = useCallback(async () => {
    await writeContractAsync({
      functionName: "closeLottery",
    });
  }, [writeContractAsync]);
  const handleWithdraw = useCallback(async () => {
    const amount = prompt("Amount:");
    if (amount) {
      await writeContractAsync({
        functionName: "prizeWithdraw",
        args: [BigInt(amount)],
      });
    }
  }, [writeContractAsync]);
  const handleBurn = useCallback(async () => {
    const amount = prompt("Amount:");
    if (amount) {
      await writeContractAsync({
        functionName: "returnTokens",
        args: [BigInt(amount)],
      });
    }
  }, [writeContractAsync]);

  return (
    <div className="bg-base-100 shadow-md rounded-xl p-6 mb-8 w-full max-w-l">
      <h2 className="text-xl font-semibold mb-4">Lottery</h2>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="mt-2">Lottery Status: {betsOpen ? "Open" : "Closed"}</div>
        <div className="mt-2">
          <BuyLotteryToken />
        </div>
        <div className="mt-2">Prize: {prize}</div>
        <button className="btn" onClick={handleWithdraw}>
          Withdraw Prize
        </button>
        <button className="btn" onClick={handleBurn}>
          Burn Token
        </button>
        {betsOpen && (
          <>
            <div className="mt-2">
              <button className="btn" onClick={handleBet}>
                Place Bets
              </button>
              <button className="btn" onClick={handleCloseLottery}>
                Close Lottery
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lottery;
