import React from 'react';
import UserProfile from './UserProfile';
import NFTGallery from './NFTGallery';
import RecentPlayers from './RecentPlayers';
import ActivityFeed from './ActivityFeed';

interface ProfilePageProps {
    address: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ address }) => {
    return (
        <div className="profile-page">
        <h1 className="page-title">Player Profile</h1>
        
        <UserProfile address={address} />
        <NFTGallery address={address} />
        
        <div className="community-section">
            <h2 className="section-title">Community</h2>
            <div className="community-grid">
            <RecentPlayers />
            <ActivityFeed />
            </div>
        </div>
        </div>
    );
}

export default ProfilePage;