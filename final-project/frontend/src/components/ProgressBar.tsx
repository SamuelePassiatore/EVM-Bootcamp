import React from 'react';

interface ProgressBarProps {
    currentLevel: number;
    totalLevels: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentLevel, totalLevels }) => {
    const progressPercentage = ((currentLevel - 1) / (totalLevels - 1)) * 100;
    
    return (
        <div className="progress-container">
        <div className="level-indicator">
            Level {currentLevel} of {totalLevels}
        </div>
        <div className="progress-bar">
            <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
            />
        </div>
        <div className="progress-percentage">
            {Math.round(progressPercentage)}% Complete
        </div>
        </div>
    );
};

export default ProgressBar;