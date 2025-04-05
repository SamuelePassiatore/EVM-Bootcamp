import { useCallback } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const LotteryAdmin: React.FC = () => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "Lottery",
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

  return (
    <div className="bg-base-100 shadow-md rounded-xl p-6 mb-8 w-full max-w-l">
      <h2 className="text-xl font-semibold mb-4">Lottery Admin</h2>
      <div className="flex items-center flex-col flex-grow pt-10">
        <button className="btn" onClick={startLottery}>
          Start Lottery
        </button>
      </div>
    </div>
  );
};

export default LotteryAdmin;
