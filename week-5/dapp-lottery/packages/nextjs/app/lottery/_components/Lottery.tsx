"use client";

import { useCallback } from "react";
import { abi } from "../../../artifacts/contracts/LotteryToken.sol/LotteryToken.json";
import type { SharedProps } from "../utils";
import BuyLotteryToken from "./BuyLotteryToken";
import { createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import {
  useFetchBlocks,
  useScaffoldContract,
  useScaffoldReadContract,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";
import type { TransactionWithFunction } from "~~/utils/scaffold-eth";

const MAXUINT256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

const Lottery: React.FC<SharedProps> = ({ address, token }: SharedProps) => {
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
  const { data: prizePool } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "prizePool",
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Lottery",
  });
  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } = useFetchBlocks();

  const handleBet = useCallback(async () => {
    const walletClient = createWalletClient({
      chain: hardhat,
      transport: http(),
    });
    if (betFee && betPrice) {
      await walletClient.writeContract({
        account: address,
        address: token,
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
  }, [address, token, writeContractAsync, betFee, betPrice, lotteryContract]);

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
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-start w-1/3 space-y-4">
          <div className="p-3 rounded-lg w-full">
            <span className="font-semibold">Lottery Status: </span>
            <span className={`${betsOpen ? "text-green-600" : "text-red-600"}`}>{betsOpen ? "Open" : "Closed"}</span>
          </div>

          <div className="w-full">
            <BuyLotteryToken />
          </div>

          <div className="flex justify-between w-full p-3 rounded-lg">
            <div>
              <span className="font-semibold">Prize for withdraw:</span>
              <div className="text-lg">{prize}</div>
            </div>
            <div>
              <span className="font-semibold">Prize Pool:</span>
              <div className="text-lg">{prizePool}</div>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button className="btn flex-1" onClick={handleWithdraw}>
              Withdraw Prize
            </button>
            <button className="btn flex-1" onClick={handleBurn}>
              Burn Token
            </button>
          </div>

          {betsOpen && (
            <div className="flex gap-3 w-full">
              <button className="btn flex-1 bg-green-700" onClick={handleBet}>
                Place Bets
              </button>
              <button className="btn flex-1 bg-red-700" onClick={handleCloseLottery}>
                Close Lottery
              </button>
            </div>
          )}
        </div>

        {betsOpen && (
          <div className="w-2/3 pl-8">
            <table className="table w-full">
              <caption className="caption-top">Bets scanned from blocks</caption>
              <caption className="caption-bottom">plz refresh to view latest transaction</caption>
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Lottery Contract</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {blocks
                  .flatMap<TransactionWithFunction>(block => block.transactions as TransactionWithFunction[])
                  .filter(trx => trx.functionName === "bet" && trx.to === lotteryContract?.address.toLowerCase())
                  .map(trx => {
                    return (
                      <tr key={trx.hash}>
                        <td>{trx.from}</td>
                        <td>{trx.to}</td>
                        <td>1</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="btn btn-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={BigInt(currentPage) >= totalBlocks - 1n}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lottery;
