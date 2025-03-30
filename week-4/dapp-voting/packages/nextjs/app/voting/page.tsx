"use client";

import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { CastVote } from "./_components/CastVote";
import { CheckVotingPower } from "./_components/CheckVotingPower";
import { DelegateVote } from "./_components/DelegateVote";
import { QueryResults } from "./_components/QueryResults";
import { MintTokens } from "./_components/MintTokens";

const VotingPage = () => {
    const { address: connectedAddress } = useAccount();

    return (
        <div className="flex items-center flex-col pt-10 px-4">
        <h1 className="text-center mb-6">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Tokenized Ballot dApp</span>
        </h1>

        {/* Connected wallet info */}
        <div className="bg-base-100 shadow-md rounded-xl p-6 mb-8 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Your Wallet</h2>
            <div className="flex justify-center">
            <Address address={connectedAddress} />
            </div>
        </div>

        {/* Add CheckVotingPower component */}
        <div className="w-full max-w-lg mb-8">
            <CheckVotingPower />
        </div>

        {/* Action components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <CastVote />
            <DelegateVote />
            <QueryResults />
            <MintTokens />
        </div>
        </div>
    );
};

export default VotingPage;