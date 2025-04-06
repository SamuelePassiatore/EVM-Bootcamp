import { useCallback } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const LotteryAdmin: React.FC = () => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Lottery",
  });

  const { data: ownerPool } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "ownerPool",
  });

  const startLottery = useCallback(async () => {
    // closed at 1 days later
    const closeTime = new Date().getTime() + 1000 * 60 * 60 * 24;
    const closeTimeInSeconds = Math.floor(closeTime / 1000);
    await writeContractAsync({
      functionName: "openBets",
      args: [BigInt(closeTimeInSeconds)],
    });
  }, [writeContractAsync]);
  const closeLottery = useCallback(async () => {
    await writeContractAsync({
      functionName: "closeLotteryForce",
    });
  }, [writeContractAsync]);
  const withdrawFeePool = useCallback(async () => {
    const amount = prompt("Amount:");
    if (amount) {
      await writeContractAsync({
        functionName: "ownerWithdraw",
        args: [BigInt(amount)],
      });
    }
  }, [writeContractAsync]);

  return (
    <div className="bg-base-100 shadow-md rounded-xl p-6 mb-8 w-full max-w-l">
      <h2 className="text-xl font-semibold mb-4">Lottery Admin</h2>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="mt-2">Owner Pool: {ownerPool}</div>
        <button className="btn" onClick={startLottery}>
          Start Lottery
        </button>
        <button className="btn" onClick={closeLottery}>
          Close Lottery Force
        </button>
        <button className="btn" onClick={withdrawFeePool}>
          Withdraw Fee Pool
        </button>
      </div>
    </div>
  );
};

export default LotteryAdmin;
