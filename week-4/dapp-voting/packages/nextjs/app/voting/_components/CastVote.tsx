"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { voteEvents } from "./DelegateVote";

export const CastVote = () => {
    const { address } = useAccount();
    const [proposalId, setProposalId] = useState<string>("0");
    const [voteAmount, setVoteAmount] = useState<string>("1");
    const [isLoading, setIsLoading] = useState(false);
    const [isRandomVoting, setIsRandomVoting] = useState(false);

    // Get remaining voting power for random voting
    const { data: remainingVotes, refetch: refetchRemainingVotes } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "getRemainingVotingPower",
        args: [address!],
        query: { enabled: !!address },
    });

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
            
            // Record the vote in backend
            try {
                await fetch("http://localhost:3001/votes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        voter: address,
                        proposalId: Number(proposalId),
                        amount: Number(voteAmount),
                        transactionHash: tx,
                    }),
                });
            } catch (error) {
                console.error("Error recording vote:", error);
            }
            
            setProposalId("0");
            setVoteAmount("1");
            voteEvents.emit('voteCasted');
            refetchRemainingVotes();
        } catch (error) {
            console.error("Error casting vote:", error);
            notification.error(`Failed to cast vote: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRandomVote = async () => {
        if (!address || !remainingVotes || remainingVotes === 0n) {
            notification.error("No voting power remaining");
            return;
        }

        setIsRandomVoting(true);
        // Convert remainingVotes from bigint to number (safely)
        const maxVotes = Number(remainingVotes > 10000n ? 10000n : remainingVotes);
        
        // Generate random amount between 1 and maxVotes (or remaining votes if smaller)
        const randomAmount = Math.floor(Math.random() * maxVotes) + 1;
        
        // Generate random proposal ID between 0 and 2
        const randomProposalId = Math.floor(Math.random() * 3);
        
        // Set the values in the UI (optional - gives visual feedback about what was randomly selected)
        setProposalId(randomProposalId.toString());
        setVoteAmount(randomAmount.toString());
        
        setIsRandomVoting(false);
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
            
            <div className="flex flex-col md:flex-row gap-2 mt-2">
                <button
                    className="btn btn-primary flex-1"
                    onClick={handleVote}
                    disabled={isLoading || isRandomVoting}
                >
                    {isLoading ? <span className="loading loading-spinner"></span> : "Cast Vote"}
                </button>
                
                <button
                    className="btn btn-primary flex-1"
                    onClick={handleRandomVote}
                    disabled={isLoading || isRandomVoting || !remainingVotes || remainingVotes === 0n}
                >
                    {isRandomVoting ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>Set Random Vote</span>
                            <span className="text-xs">🎲</span>
                        </div>
                    )}
                </button>
            </div>
            
            {/* Show information about random voting */}
            <div className="text-xs text-base-content/70 mt-1">
                <p>Random vote will select a random proposal (0-2) and amount from your available voting power.</p>
            </div>
        </div>
        </div>
    );
};