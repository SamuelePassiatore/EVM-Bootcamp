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
  const { isConnected, address } = useAccount();
  
  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="https://www.cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" alt="Logo" />
        </div>
        <div className="app-name">
          <h1>MyDApp</h1>
        </div>
        <div className="network-selector">
          <appkit-network-button />
        </div>
        <div className="wallet-connect">
          <appkit-button />
        </div>
        {isConnected && (
          <div className="connected-info">
            <p>Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}</p>
          </div>
        )}
      </header>
    </>
  );
}

export default App;