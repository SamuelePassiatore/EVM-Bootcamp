import React, { useEffect, useState } from 'react';
import { fetchRewards } from '../services/api';

interface NFTGalleryProps {
    address: string;
}

const NFTGallery: React.FC<NFTGalleryProps> = ({ address }) => {
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadNFTs() {
        if (!address) return;
        
        try {
            const rewards = await fetchRewards();
            setNfts(rewards || []);
        } catch (error) {
            console.error("Error loading NFTs:", error);
        } finally {
            setLoading(false);
        }
        }
        
        loadNFTs();
    }, [address]);

    if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading NFTs...</p></div>;
    
    if (nfts.length === 0) {
        return (
        <div className="nft-gallery empty">
            <h3>NFT Collection</h3>
            <p>You haven't earned any NFTs yet. Complete quizzes to earn rewards!</p>
        </div>
        );
    }

    return (
        <div className="nft-gallery">
        <h3>NFT Collection</h3>
        <div className="nft-grid">
            {nfts.map((nft) => (
            <div key={nft._id || nft.tokenId} className="nft-card">
                <div className="nft-image" dangerouslySetInnerHTML={{ __html: nft.svgCode }} />
                <div className="nft-details">
                <h4>{nft.name}</h4>
                <p>{nft.description}</p>
                <div className="nft-metadata">
                    <span>Level {nft.level}</span>
                    <span>Token #{nft.tokenId}</span>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}

export default NFTGallery;