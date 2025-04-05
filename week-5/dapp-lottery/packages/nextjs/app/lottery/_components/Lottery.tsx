"use client";

import { useCallback } from "react";
import { SharedProps } from "../utils";
import BuyLotteryToken from "./BuyLotteryToken";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Lottery: React.FC<SharedProps> = ({ address }: SharedProps) => {
  const { data: prize } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "prize",
    args: [address],
  });
  const { data: betsOpen } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "betsOpen",
  });
  const { data: paymentToken } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "paymentToken",
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
    // if (!process.env.NEXT_PUBLIC_LOTTERY_ADDRESS) {
    //   throw new Error("NEXT_PUBLIC_TOKEN_ADDRESS is not defined");
    // }
    // const walletClient = createWalletClient({
    //   chain: hardhat,
    //   transport: http(),
    // });
    // if (betFee && betPrice) {
    //   await walletClient.writeContract({
    //     account: address,
    //     address: process.env.NEXT_PUBLIC_LOTTERY_ADDRESS,
    //     functionName: "approve",
    //     abi: abi,
    //     args: [address, betFee * betPrice],
    //   });
    // } else {
    //   throw new Error("Bet fee or price is not available");
    // }

    await writeContractAsync({
      functionName: "bet",
    });
  }, [address, writeContractAsync, betFee, betPrice]);

  return (
    <div className="bg-base-100 shadow-md rounded-xl p-6 mb-8 w-full max-w-l">
      <h2 className="text-xl font-semibold mb-4">Lottery</h2>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="mt-2">Lottery Status: {betsOpen ? "Open" : "Closed"}</div>
        <div className="mt-2">
          <BuyLotteryToken />
        </div>
        {betsOpen && (
          <>
            <div className="mt-2">Bets: {prize}</div>
            <div className="mt-2">
              <button className="btn" onClick={handleBet}>
                Place Bets
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Lottery;
