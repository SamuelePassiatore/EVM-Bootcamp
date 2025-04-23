import React, { useEffect, useState } from 'react';
import { fetchRecentPlayers } from '../services/api';

const RecentPlayers: React.FC = () => {
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadRecentPlayers() {
        try {
            const recentPlayers = await fetchRecentPlayers();
            setPlayers(recentPlayers);
        } catch (error) {
            console.error("Error loading recent players:", error);
        } finally {
            setLoading(false);
        }
        }
        
        loadRecentPlayers();
        // Set up polling to refresh data
        const interval = setInterval(loadRecentPlayers, 60000);
        return () => clearInterval(interval);
    }, []);
    
    if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading community data...</p></div>;
    
    if (players.length === 0) {
        return (
        <div className="recent-players empty">
            <h3>QuizChain Community</h3>
            <p>No players have joined yet. Be the first!</p>
        </div>
        );
    }
    
    return (
        <div className="recent-players">
        <h3>QuizChain Community</h3>
        
        <div className="players-grid">
            {players.map((player) => (
            <div key={player.id} className="player-card">
                <div className="player-avatar">
                <img src={`https://effigy.im/a/${player.walletAddress}.svg`} alt="Player avatar" />
                </div>
                <div className="player-info">
                <h4>{player.walletAddress.slice(0, 6)}...{player.walletAddress.slice(-4)}</h4>
                <div className="player-stats">
                    <span>Level {player.questionLevel}</span>
                    <span>{player.nftCount} NFTs</span>
                </div>
                <div className="player-joined">
                    Joined {new Date(player.createdAt).toLocaleDateString()}
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}

export default RecentPlayers;