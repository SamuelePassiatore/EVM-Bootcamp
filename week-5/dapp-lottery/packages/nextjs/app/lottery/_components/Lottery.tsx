"use client";

import { useCallback } from "react";
import { SharedProps } from "../utils";
import BuyLotteryToken from "./BuyLotteryToken";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

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
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Lottery",
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "LotteryToken",
  });

  const handleBet = useCallback(async () => {

    await writeContractAsync({
      functionName: "bet",
    });
  }, [writeContractAsync]);

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
