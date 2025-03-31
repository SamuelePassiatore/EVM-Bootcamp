import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { voteEvents } from "./DelegateVote";

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
    
    const { data: tokenBalance, refetch: refetchBalance } = useScaffoldReadContract({
        contractName: "MyToken",
        functionName: "balanceOf",
        args: [address!],
        query: { enabled: !!address },
    });

    const { data: currentVotes, refetch: refetchCurrentVotes } = useScaffoldReadContract({
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
        args: [address!, targetBlockNumber ?? 0n],
        query: { enabled: !!address && !!targetBlockNumber },
    });

    const { data: remainingVotes, refetch: refetchRemainingVotes } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "getRemainingVotingPower",
        args: [address!],
        query: { enabled: !!address },
    });
    
    const { data: votePowerSpent, refetch: refetchVotePowerSpent } = useScaffoldReadContract({
        contractName: "TokenizedBallot",
        functionName: "votePowerSpent",
        args: [address!],
        query: { enabled: !!address },
    });
    
    // Function to refresh all data
    const refreshData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                refetchBalance(),
                refetchCurrentVotes(),
                refetchPastVotes(),
                refetchRemainingVotes(),
                refetchVotePowerSpent()
            ]);
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (targetBlockNumber) {
            refetchPastVotes();
        }
    }, [targetBlockNumber, refetchPastVotes]);
    
    useEffect(() => {
        if (tokenBalance !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                balance: Number(formatEther(tokenBalance)).toString()
            }));
        }

        if (currentVotes !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                currentVotes: Number(formatEther(currentVotes)).toString()
            }));
        }

        if (pastVotes !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                pastVotes: Number(formatEther(pastVotes)).toString(),
            }));
        }

        if (remainingVotes !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                remainingVotes: Number(formatEther(remainingVotes)).toString(),
            }));
        }

        if (votePowerSpent !== undefined) {
            setVotingPower(prev => ({
                ...prev,
                spentVotes: Number(votePowerSpent).toString(),
            }));
        }

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
        const handleDelegationCompleted = () => {
            refreshData();
        };

        const handleVoteCasted = () => {
            refreshData();
        };

        voteEvents.on('delegationCompleted', handleDelegationCompleted);
        voteEvents.on('voteCasted', handleVoteCasted);
        
        return () => {
            voteEvents.listeners['delegationCompleted'] =
                voteEvents.listeners['delegationCompleted']?.filter(
                    listener => listener !== handleDelegationCompleted
                );
            voteEvents.listeners['voteCasted'] =
                voteEvents.listeners['voteCasted']?.filter(
                    listener => listener !== handleVoteCasted
                );
        };
    }, []);

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
                    
                    {/* Add refresh button */}
                    <div className="flex justify-end mt-4">
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={refreshData}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                "Refresh Voting Power"
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};