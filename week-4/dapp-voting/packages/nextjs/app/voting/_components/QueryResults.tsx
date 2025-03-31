"use client";

import { useEffect, useState } from "react";
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

    // We need separate hook calls for each proposal
    const { data: proposal0, isLoading: isLoading0 } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "proposals",
        args: [0n],
    });

    const { data: proposal1, isLoading: isLoading1 } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "proposals",
        args: [1n],
    });

    const { data: proposal2, isLoading: isLoading2 } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "proposals",
        args: [2n],
    });

    // Process proposals after they're loaded
    useEffect(() => {
        if (winnerName) {
            setWinningProposal(bytes32ToString(winnerName));
        }
        if (winningProposalId) {
            setWinningId(winningProposalId.toString());
        }

        // Wait for all proposal data to load
        if (isLoading0 || isLoading1 || isLoading2) {
            return;
        }

        // Process the proposals
        try {
            const proposalsArray: ProposalResult[] = [];
            let totalVotesCast = 0n;

            // Add each valid proposal to our array
            const proposalData = [proposal0, proposal1, proposal2];
            
            for (let i = 0; i < proposalData.length; i++) {
                const data = proposalData[i];
                if (data) {
                    const [name, voteCount] = data as [string, bigint];
                    proposalsArray.push({
                        id: i,
                        name: bytes32ToString(name),
                        voteCount: Number(voteCount).toString(),
                        percentage: 0,
                    });
                    totalVotesCast += voteCount;
                }
            }

            // Calculate percentages
            if (totalVotesCast > 0n) {
                proposalsArray.forEach(proposal => {
                    const votesBigInt = BigInt(Math.floor(parseFloat(proposal.voteCount)));
                    proposal.percentage = Number((votesBigInt * 10000n) / totalVotesCast) / 100;
                });
            }

            setTotalVotes(totalVotesCast);
            setProposals(proposalsArray);
            setIsLoading(false);
        } catch (error) {
            console.error("Error processing proposals:", error);
            setIsLoading(false);
        }
    }, [proposal0, proposal1, proposal2, isLoading0, isLoading1, isLoading2, winnerName, winningProposalId]);

    // Ensure loading state doesn't get stuck
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 10000);
        return () => clearTimeout(timer);
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
                onClick={() => window.location.reload()}
                >
                Refresh Results
                </button>
            </div>
            </div>
        )}
        </div>
    );
};