"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

export const MintTokens = () => {
    const { address } = useAccount();
    const [amount, setAmount] = useState<string>("10");
    const [isLoading, setIsLoading] = useState(false);

    const mintTokens = async () => {
        if (!address || !amount) return;
        
        setIsLoading(true);
        try {
        const response = await fetch("/api/mint", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            account: address,
            amount: parseFloat(amount),
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to mint tokens");
        }
        
        const data = await response.json();
        notification.success(`Successfully minted tokens! Transaction: ${data.txHash}`);
        setAmount("10");
        } catch (error) {
        console.error("Error minting tokens:", error);
        notification.error(`Failed to mint tokens: ${(error as Error).message}`);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="bg-base-100 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Mint Voting Tokens</h2>
        <div className="flex flex-col gap-4">
            <div className="form-control">
            <label className="label">
                <span className="label-text">Amount</span>
            </label>
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered"
            />
            </div>
            <button 
            className="btn btn-primary"
            onClick={mintTokens}
            disabled={isLoading}
            >
            {isLoading ? <span className="loading loading-spinner"></span> : "Mint Tokens"}
            </button>
        </div>
        </div>
    );
};