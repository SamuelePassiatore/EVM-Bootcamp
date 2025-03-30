"use client";

import { useState } from "react";
import { isAddress } from "viem";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const DelegateVote = () => {
    const [delegateAddress, setDelegateAddress] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const { writeContractAsync } = useScaffoldWriteContract({
        contractName: "MyToken",
    });

    const handleDelegate = async () => {
        if (!delegateAddress || !isAddress(delegateAddress)) return;
        
        setIsLoading(true);
        try {
        const tx = await writeContractAsync({
            functionName: "delegate",
            args: [delegateAddress],
        });
        
        notification.success(`Successfully delegated votes! Transaction: ${tx}`);
        setDelegateAddress("");
        } catch (error) {
        console.error("Error delegating votes:", error);
        notification.error(`Failed to delegate: ${(error as Error).message}`);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="bg-base-100 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Delegate Voting Power</h2>
        <div className="flex flex-col gap-4">
            <div className="form-control">
            <label className="label">
                <span className="label-text">Delegate Address</span>
            </label>
            <AddressInput
                value={delegateAddress}
                onChange={setDelegateAddress}
                placeholder="Address to delegate to"
            />
            </div>
            <button 
            className="btn btn-primary"
            onClick={handleDelegate}
            disabled={isLoading || !isAddress(delegateAddress)}
            >
            {isLoading ? <span className="loading loading-spinner"></span> : "Delegate"}
            </button>
        </div>
        </div>
    );
};