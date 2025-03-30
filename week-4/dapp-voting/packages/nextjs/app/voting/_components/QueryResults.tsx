"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface ProposalResult {
    id: number;
    name: string;
    voteCount: string;
    percentage: number;
}

export const QueryResults = () => {
    const [proposals, setProposals] = useState<ProposalResult[]>([]);
    const [winningProposal, setWinningProposal] = useState<string>("");
    const [winningId, setWinningId] = useState<string>("0");
    const [isLoading, setIsLoading] = useState(true);
    const [totalVotes, setTotalVotes] = useState<bigint>(0n);

    // Get winner name and ID
    const { data: winnerName } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "winnerName",
    });

    const { data: winningProposalId } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "winningProposal",
    });

    // Function to convert bytes32 to string
    const bytes32ToString = (bytes32: string): string => {
        // Remove 0x prefix, convert to buffer, and remove null bytes
        const hex = bytes32.substring(2);
        const buf = Buffer.from(hex, 'hex');
        return new TextDecoder().decode(buf).replace(/\0/g, '');
    };

    // Function to fetch all proposals and their vote counts
    const fetchProposals = async () => {
        setIsLoading(true);
        try {
        const proposalsArray: ProposalResult[] = [];
        let totalVotesCast = 0n;
        
        // Try to read proposals until we get an error (out of bounds)
        for (let i = 0; ; i++) {
            try {
            const { data } = await refetchProposal({
                args: [BigInt(i)],
            });
            
            if (data) {
                const [name, voteCount] = data as [string, bigint];
                proposalsArray.push({
                id: i,
                name: bytes32ToString(name),
                voteCount: formatEther(voteCount),
                percentage: 0, // Will calculate after getting total
                });
                totalVotesCast += voteCount;
            }
            } catch (error) {
            // We've reached the end of the proposals
            break;
            }
        }
        
        // Calculate percentages
        if (totalVotesCast > 0n) {
            proposalsArray.forEach(proposal => {
            const votesBigInt = BigInt(Math.floor(parseFloat(proposal.voteCount) * 1e18));
            proposal.percentage = Number((votesBigInt * 10000n) / totalVotesCast) / 100;
            });
        }
        
        setTotalVotes(totalVotesCast);
        setProposals(proposalsArray);
        } catch (error) {
        console.error("Error fetching proposals:", error);
        } finally {
        setIsLoading(false);
        }
    };

    const { refetch: refetchProposal } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "proposals",
        args: [0n],
    });

    useEffect(() => {
        if (winnerName) {
        setWinningProposal(bytes32ToString(winnerName));
        }
        if (winningProposalId) {
        setWinningId(winningProposalId.toString());
        }
    }, [winnerName, winningProposalId]);

    useEffect(() => {
        fetchProposals();
    }, []);

    return (
        <div className="bg-base-100 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Voting Results</h2>
        
        {isLoading ? (
            <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
            </div>
        ) : (
            <div className="flex flex-col gap-4">
            <div className="bg-base-200 p-4 rounded-lg">
                <h3 className="font-medium">Current Winner</h3>
                <p className="text-lg">{winningProposal || "No winner yet"}</p>
                <p className="text-sm">Proposal ID: {winningId}</p>
            </div>
            
            <div>
                <h3 className="font-medium mb-2">All Proposals</h3>
                <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Votes</th>
                        <th>Percentage</th>
                    </tr>
                    </thead>
                    <tbody>
                    {proposals.map((proposal) => (
                        <tr key={proposal.id} className={proposal.id.toString() === winningId ? "bg-primary/20" : ""}>
                        <td>{proposal.id}</td>
                        <td>{proposal.name}</td>
                        <td>{proposal.voteCount}</td>
                        <td>{proposal.percentage.toFixed(2)}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            
            <div className="flex justify-end">
                <button
                className="btn btn-outline btn-sm"
                onClick={fetchProposals}
                >
                Refresh Results
                </button>
            </div>
            </div>
        )}
        </div>
    );
};