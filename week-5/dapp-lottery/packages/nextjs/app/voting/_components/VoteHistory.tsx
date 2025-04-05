"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface VoteRecord {
    voter: string;
    proposalId: number;
    amount: number;
    transactionHash: string;
    timestamp?: string;
}

export const VoteHistory = () => {
    const { address } = useAccount();
    const [recentVotes, setRecentVotes] = useState<VoteRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch vote history
    const fetchVoteHistory = async () => {
        setIsLoading(true);
        try {
        const response = await fetch("http://localhost:3001/votes/recent");
        if (!response.ok) {
            throw new Error("Failed to fetch vote history");
        }
        const data = await response.json();
        setRecentVotes(data);
        } catch (error) {
        console.error("Error fetching vote history:", error);
        notification.error(`Failed to load vote history: ${(error as Error).message}`);
        } finally {
        setIsLoading(false);
        }
    };

    // Fetch votes on component mount
    useEffect(() => {
        fetchVoteHistory();
    }, []);

    // Function to get proposal name from ID (you can enhance this)
    const getProposalName = (id: number) => {
        const proposals = ["Proposal 1", "Proposal 2", "Proposal 3"];
        return proposals[id] || `Proposal ${id}`;
    };

    // Record a vote (from CastVote component)
    const recordVote = async (proposalId: number, amount: number, transactionHash: string) => {
        if (!address) return;
        
        try {
        await fetch("http://localhost:3001/votes", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            voter: address,
            proposalId,
            amount,
            transactionHash,
            }),
        });
        
        // Refresh the vote history
        fetchVoteHistory();
        } catch (error) {
        console.error("Error recording vote:", error);
        }
    };

    return (
        <div className="bg-base-100 shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Votes</h2>
            <button 
            className="btn btn-sm btn-outline" 
            onClick={fetchVoteHistory}
            disabled={isLoading}
            >
            {isLoading ? <span className="loading loading-spinner loading-xs"></span> : "Refresh"}
            </button>
        </div>
        
        {isLoading ? (
            <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-md"></span>
            </div>
        ) : recentVotes.length === 0 ? (
            <p className="text-center py-4">No votes recorded yet</p>
        ) : (
            <div className="overflow-x-auto">
            <table className="table w-full">
                <thead>
                <tr>
                    <th>Voter</th>
                    <th>Proposal</th>
                    <th>Amount</th>
                    <th>Transaction</th>
                </tr>
                </thead>
                <tbody>
                {recentVotes.map((vote, index) => (
                    <tr key={index}>
                    <td>
                        <Address address={vote.voter as `0x${string}`} size="sm" />
                    </td>
                    <td>{getProposalName(vote.proposalId)}</td>
                    <td>{vote.amount} votes</td>
                    <td>
                        <a 
                        href={`https://sepolia.etherscan.io/tx/${vote.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary"
                        >
                        View
                        </a>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </div>
    );
};