import React from 'react';

interface NFTDisplayProps {
    level: number;
    svgCode?: string;
    tokenId?: string;
    isPreview?: boolean;
}

const NFTDisplay: React.FC<NFTDisplayProps> = ({ level, svgCode, tokenId, isPreview = false }) => {
    return (
        <div className="nft-display-card">
        <h3 className="nft-title">
            {isPreview
            ? `Level ${level} Reward Preview`
            : `Level ${level} Achievement`
            }
        </h3>
        
        <div className="nft-image-frame">
            {svgCode ? (
            <div
                className="nft-image"
                dangerouslySetInnerHTML={{ __html: svgCode }}
            />
            ) : (
            <div className="nft-placeholder">
                <img src="/quiz.png" alt="NFT Placeholder" className="placeholder-img" />
            </div>
            )}
        </div>
        
        <div className="nft-details">
            <p className="nft-description">
            {isPreview
                ? "Complete this level to claim your unique NFT reward!"
                : `NFT Reward for Level ${level}`
            }
            </p>
            
            {tokenId && (
            <div className="nft-id">#{tokenId}</div>
            )}
        </div>
        </div>
    );
};

export default NFTDisplay;