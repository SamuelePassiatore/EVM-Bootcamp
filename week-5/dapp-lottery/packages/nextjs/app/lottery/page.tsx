"use client";

import Lottery from "./_components/Lottery";
import LotteryAdmin from "./_components/LotteryAdmin";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Page = () => {
  const { address: connectedAddress } = useAccount();

  const { data: owner } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "owner",
  });
  const { data: paymentToken } = useScaffoldReadContract({
    contractName: "Lottery",
    functionName: "paymentToken",
  });

  if (!connectedAddress) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="flex items-center flex-col pt-10 px-4">
      <h1 className="text-center mb-6">
        <span className="block text-2xl mb-2">Welcome to</span>
        <span className="block text-4xl font-bold">dApp</span>
      </h1>

      {/* Connected wallet info */}
      <div className="bg-base-100 shadow-md rounded-xl p-6 mb-8 w-full max-w-l">
        <h2 className="text-xl font-semibold mb-4">Your Wallet</h2>
        <div className="flex items-center flex-col flex-grow pt-10">
          <Address address={connectedAddress} format="long" />
          <div>
            ETH Balances: <Balance address={connectedAddress} useEtherFormat={true} />
          </div>
          {paymentToken && (
            <div>
              Token Balances: <Balance address={connectedAddress} token={paymentToken} />
            </div>
          )}
        </div>
      </div>
      {paymentToken && <Lottery address={connectedAddress} token={paymentToken} />}
      {owner === connectedAddress && <LotteryAdmin />}
    </div>
  );
};

export default Page;
