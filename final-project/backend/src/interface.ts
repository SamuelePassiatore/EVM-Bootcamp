export interface INFTReward {
  level: number;
  tokenId: string;
  userId: string;
  name: string;
  description: string;
  svgCode: string;
  createdAt: Date;
}

export interface IUser {
  username?: string;
  walletAddress: string;
  createdAt: Date;
  questionLevel: number;
  mintedNFT: boolean;
  isBlocked?: boolean;
  lastWrongAnswerTime?: Date | null;
}

export interface IQuestion {
  level: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  createdAt: Date;
}
