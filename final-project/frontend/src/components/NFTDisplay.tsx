import React, { useState, useEffect } from 'react';

interface NFTDisplayProps {
    level: number;
    svgCode?: string;
    tokenId?: string;
    isPreview?: boolean;
    isAnimating?: boolean;
}

const NFTDisplay: React.FC<NFTDisplayProps> = ({
    level,
    svgCode,
    tokenId,
    isPreview = false,
    isAnimating = false
}) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(!!svgCode);
    
    // Simulate loading effect when SVG changes
    useEffect(() => {
        setIsLoaded(false);
        const timer = setTimeout(() => setIsLoaded(!!svgCode), 300);
        return () => clearTimeout(timer);
    }, [svgCode]);

    const getBackgroundColor = () => {
        // Different background colors based on level
        const colors = [
        '#1a202c', // Level 1
        '#1e3a8a', // Level 2
        '#3c366b', // Level 3
        '#44337a', // Level 4
        '#702459', // Level 5
        '#742a2a', // Level 6
        '#22543d', // Level 7
        ];
        
        // Use the level to determine color, default to first color if level is out of range
        return colors[(level - 1) % colors.length] || colors[0];
    };
    
    return (
        <div className={`nft-display-card ${isAnimating ? 'minting-animation' : ''}`}>
        <h3 className="nft-title" style={{ backgroundColor: getBackgroundColor() }}>
            {isPreview
            ? `Level ${level} Reward Preview`
            : `Level ${level} Achievement`
            }
        </h3>
        
        <div 
            className="nft-image-frame"
            style={{ backgroundColor: getBackgroundColor() }}
        >
            {!isLoaded ? (
            <div className="nft-loading">
                <div className="spinner"></div>
            </div>
            ) : svgCode ? (
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
            <div className="nft-id">Token #{tokenId}</div>
            )}
            
            {isPreview && (
            <div className="nft-preview-label">Preview</div>
            )}
        </div>
        </div>
    );
};

export default NFTDisplay;