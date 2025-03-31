"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { voteEvents } from "./DelegateVote";

export const CastVote = () => {
    const [proposalId, setProposalId] = useState<string>("0");
    const [voteAmount, setVoteAmount] = useState<string>("1");
    const [isLoading, setIsLoading] = useState(false);

    const { writeContractAsync } = useScaffoldWriteContract({
        contractName: "TokenizedBallot",
    });

    const handleVote = async () => {
        if (!proposalId || !voteAmount) return;
        setIsLoading(true);
        try {
            const tx = await writeContractAsync({
                functionName: "vote",
                args: [BigInt(proposalId), BigInt(voteAmount)],
            });
            notification.success(`Vote cast successfully! Transaction: ${tx}`);
            setProposalId("0");
            setVoteAmount("1");
            voteEvents.emit('voteCasted');
        } catch (error) {
            console.error("Error casting vote:", error);
            notification.error(`Failed to cast vote: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-base-100 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Cast Vote</h2>
        <div className="flex flex-col gap-4">
            <div className="form-control">
            <label className="label">
                <span className="label-text">Proposal ID</span>
            </label>
            <input
                type="number"
                min="0"
                max="2"
                value={proposalId}
                onChange={(e) => setProposalId(e.target.value)}
                className="input input-bordered"
            />
            </div>
            <div className="form-control">
            <label className="label">
                <span className="label-text">Amount of Votes</span>
            </label>
            <input
                type="text"
                value={voteAmount}
                onChange={(e) => setVoteAmount(e.target.value)}
                className="input input-bordered"
            />
            </div>
            <button
            className="btn btn-primary"
            onClick={handleVote}
            disabled={isLoading}
            >
            {isLoading ? <span className="loading loading-spinner"></span> : "Cast Vote"}
            </button>
        </div>
        </div>
    );
};