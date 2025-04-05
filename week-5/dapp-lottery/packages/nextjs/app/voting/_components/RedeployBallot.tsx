import { useState } from "react";
import { notification } from "~~/utils/scaffold-eth";

export const RedeployBallot = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleRedeploy = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3001/redeploy-ballot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error("Failed to redeploy ballot");
            }
            const data = await response.json();
            notification.success(`Ballot redeployed successfully! New contract: ${data.newContractAddress}`);
        } catch (error) {
            console.error("Error redeploying ballot:", error);
            notification.error(`Failed to redeploy: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-base-100 shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
            <p className="mb-4">
                Need to update the target block to include recent token mints and delegations?
                This will redeploy the ballot with current block as the target.
            </p>
            <button
                className="btn btn-warning"
                onClick={handleRedeploy}
                disabled={isLoading}
            >
                {isLoading ? <span className="loading loading-spinner"></span> : "Redeploy Ballot Contract"}
            </button>
        </div>
    );
};