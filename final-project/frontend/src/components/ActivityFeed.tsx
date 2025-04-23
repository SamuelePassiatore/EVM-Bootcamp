import React, { useEffect, useState } from 'react';
import { fetchRecentActivity } from '../services/api';

interface ActivityItem {
    id: string;
    type: 'level_up' | 'nft_mint' | 'new_player';
    walletAddress: string;
    details: any;
    timestamp: string;
}

const ActivityFeed: React.FC = () => {
    const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadActivityFeed() {
        try {
            const activities = await fetchRecentActivity();
            setActivityItems(activities);
        } catch (error) {
            console.error("Error loading activity feed:", error);
        } finally {
            setLoading(false);
        }
        }
        
        loadActivityFeed();
        // Set up polling to refresh data
        const interval = setInterval(loadActivityFeed, 30000);
        return () => clearInterval(interval);
    }, []);
    
    if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading activity feed...</p></div>;
    
    if (activityItems.length === 0) {
        return (
        <div className="activity-feed empty">
            <h3>Recent Activity</h3>
            <p>No activity recorded yet. Start playing to see updates here!</p>
        </div>
        );
    }
    
    return (
        <div className="activity-feed">
        <h3>Recent Activity</h3>
        
        <div className="feed-items">
            {activityItems.map((item) => (
            <div key={item.id} className={`feed-item ${item.type}`}>
                <div className="feed-icon">
                {item.type === 'level_up' && '🏆'}
                {item.type === 'nft_mint' && '🎁'}
                {item.type === 'new_player' && '👋'}
                </div>
                <div className="feed-content">
                <p>
                    <span className="address">
                    {item.walletAddress.slice(0, 6)}...{item.walletAddress.slice(-4)}
                    </span>
                    {item.type === 'level_up' && ` reached level ${item.details.level}`}
                    {item.type === 'nft_mint' && ` minted a new NFT: ${item.details.name}`}
                    {item.type === 'new_player' && ` joined QuizChain`}
                </p>
                <span className="timestamp">
                    {new Date(item.timestamp).toLocaleString()}
                </span>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}

export default ActivityFeed;