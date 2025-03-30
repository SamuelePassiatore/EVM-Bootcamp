"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const CheckVotingPower = () => {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(true);
    const [votingPower, setVotingPower] = useState({
        balance: "0",
        currentVotes: "0",
        pastVotes: "0",
        remainingVotes: "0",
        spentVotes: "0"
    });

    const { data: tokenBalance } = useScaffoldReadContract({
        contractName: "MyToken",
        functionName: "balanceOf",
        args: [address!],
        enabled: !!address,
    });

    const { data: currentVotes } = useScaffoldReadContract({
        contractName: "MyToken",
        functionName: "getVotes",
        args: [address!],
        enabled: !!address,
    });

    const { data: targetBlockNumber } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "targetBlockNumber",
    });

    const { data: pastVotes, refetch: refetchPastVotes } = useScaffoldReadContract({
        contractName: "MyToken",
        functionName: "getPastVotes",
        args: [address!, targetBlockNumber || 0n],
        enabled: !!address && !!targetBlockNumber,
    });

    const { data: remainingVotes } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "getRemainingVotingPower",
        args: [address!],
        enabled: !!address,
    });

    const { data: votePowerSpent } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "votePowerSpent",
        args: [address!],
        enabled: !!address,
    });

    useEffect(() => {
        if (tokenBalance !== undefined && currentVotes !== undefined && 
            pastVotes !== undefined && remainingVotes !== undefined && 
            votePowerSpent !== undefined) {
        setVotingPower({
            balance: formatEther(tokenBalance),
            currentVotes: formatEther(currentVotes),
            pastVotes: formatEther(pastVotes),
            remainingVotes: formatEther(remainingVotes),
            spentVotes: formatEther(votePowerSpent)
        });
        setIsLoading(false);
        }
    }, [tokenBalance, currentVotes, pastVotes, remainingVotes, votePowerSpent]);

    useEffect(() => {
        if (targetBlockNumber) {
        refetchPastVotes();
        }
    }, [targetBlockNumber, refetchPastVotes]);

    return (
        <div className="bg-base-100 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Voting Power</h2>
        
        {isLoading ? (
            <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
            </div>
        ) : (
            <div className="space-y-2">
            <div className="flex justify-between">
                <span>Token Balance:</span>
                <span className="font-medium">{votingPower.balance} MTK</span>
            </div>
            <div className="flex justify-between">
                <span>Current Voting Power:</span>
                <span className="font-medium">{votingPower.currentVotes} votes</span>
            </div>
            <div className="flex justify-between">
                <span>Voting Power at Target Block:</span>
                <span className="font-medium">{votingPower.pastVotes} votes</span>
            </div>
            <div className="flex justify-between">
                <span>Remaining Voting Power:</span>
                <span className="font-medium">{votingPower.remainingVotes} votes</span>
            </div>
            <div className="flex justify-between">
                <span>Votes Already Cast:</span>
                <span className="font-medium">{votingPower.spentVotes} votes</span>
            </div>
            </div>
        )}
        </div>
    );
};