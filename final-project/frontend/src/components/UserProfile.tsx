import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../services/api';

interface UserProfileProps {
    address: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ address }) => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadProfileData() {
        if (!address) return;
        
        try {
            const userInfo = await fetchUserData();
            setUserData(userInfo);
        } catch (error) {
            console.error("Error loading profile data:", error);
        } finally {
            setLoading(false);
        }
        }
        
        loadProfileData();
    }, [address]);
    
    if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading profile...</p></div>;
    if (!userData) return <div>Please connect your wallet to view profile</div>;
    
    return (
        <div className="user-profile">
        <div className="profile-header">
            <div className="profile-avatar">
            <img src={`https://effigy.im/a/${address}.svg`} alt="User avatar" />
            </div>
            
            <div className="profile-info">
            <h2>{address.slice(0, 6)}...{address.slice(-4)}</h2>
            <div className="profile-stats">
                <div className="stat-item">
                <span className="stat-value">{userData.questionLevel}</span>
                <span className="stat-label">Level</span>
                </div>
                <div className="stat-item">
                <span className="stat-value">{userData.mintedNFT ? 'Yes' : 'No'}</span>
                <span className="stat-label">NFT Minted</span>
                </div>
                <div className="stat-item">
                <span className="stat-value">{new Date(userData.createdAt).toLocaleDateString()}</span>
                <span className="stat-label">Joined</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default UserProfile;