import './App.css';
import { useAccount } from 'wagmi';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'appkit-network-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

function App() {
  const { isConnected } = useAccount();
  
  return (
    <>
      <header className="header">
        <div className="left-section">
          <div className="logo">
            <img src="https://www.cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" alt="Logo" />
          </div>
        </div>
        
        <div className="center-section">
          <div className="app-name">
            <h1>QuizChain</h1>
          </div>
        </div>
        
        <div className="right-section">
          {isConnected && (
            <div className="network-selector">
              <appkit-network-button />
            </div>
          )}
          <div className="wallet-connect">
            <appkit-button />
          </div>
        </div>
      </header>

      <main className="main-content">
        {!isConnected && (
          <div className="connect-prompt">
            <h2>Welcome to QuizChain!</h2>
            <p>Connect your wallet to participate in the game and access all features.</p>
            <div className="main-connect-button">
              <appkit-button />
            </div>
          </div>
        )}
        
        {isConnected && (
          <div className="game-content">
            <p>test</p>
          </div>
        )}
      </main>
    </>
  );
}

export default App;