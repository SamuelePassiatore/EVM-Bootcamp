"use client";

import { useCallback } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const BuyLotteryToken: React.FC = () => {
  const contract = useScaffoldWriteContract({
    contractName: "Lottery",
  });

  const handleBuyToken = useCallback(async () => {
    const amount = prompt("How many to buy?");
    if (!amount) return;
    const amountBn = BigInt(amount);
    await contract.writeContractAsync({
      functionName: "purchaseTokens",
      value: amountBn,
    });
  }, [contract]);

  if (contract.isPending) return <div>Loading...</div>;

  return (
    <div className="btn" onClick={handleBuyToken}>
      Buy Lottery Token
    </div>
  );
};

export default BuyLotteryToken;
