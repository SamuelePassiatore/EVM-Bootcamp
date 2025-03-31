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
        query: { enabled: !!address },
    });

    const { data: currentVotes } = useScaffoldReadContract({
        contractName: "MyToken",
        functionName: "getVotes",
        args: [address!],
        query: { enabled: !!address },
    });

    const { data: targetBlockNumber } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "targetBlockNumber",
    });

    const { data: pastVotes, refetch: refetchPastVotes } = useScaffoldReadContract({
        contractName: "MyToken",
        functionName: "getPastVotes",
        args: [address!, targetBlockNumber || 0n],
        query: { enabled: !!address && !!targetBlockNumber },
    });

    const { data: remainingVotes } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "getRemainingVotingPower",
        args: [address!],
        query: { enabled: !!address },
    });
    
    const { data: votePowerSpent } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "votePowerSpent",
        args: [address!],
        query: { enabled: !!address },
    });
    
    useEffect(() => {
        if (tokenBalance !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                balance: formatEther(tokenBalance)
            }));
        }

        if (currentVotes !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                currentVotes: formatEther(currentVotes)
            }));
        }

        if (pastVotes !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                pastVotes: formatEther(pastVotes),
            }));
        }

        if (remainingVotes !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                remainingVotes: formatEther(remainingVotes),
            }));
        }

        if (votePowerSpent !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                spentVotes: formatEther(votePowerSpent),
            }));
        }

        console.log({
            tokenBalance,
            currentVotes,
            pastVotes,
            remainingVotes,
            votePowerSpent,
            targetBlockNumber
        });

        if (tokenBalance !== undefined || currentVotes !== undefined ||
            pastVotes !== undefined || remainingVotes !== undefined ||
            votePowerSpent !== undefined) {
            setIsLoading(false);
        }
    }, [tokenBalance, currentVotes, pastVotes, remainingVotes, votePowerSpent]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 10000);
        return () => clearTimeout(timer);
    }, []);

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