import './App.css'

function App() {
  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="https://www.cryptologos.cc/logos/bitcoin-btc-logo.png?v=040" alt="Logo" />
        </div>
        <div className="app-name">
          <h1>MyDApp</h1>
        </div>
        <div className="wallet-connect">
          <button className="connect-button">Connect Wallet</button>
        </div>
      </header>
    </>
  )
}

export default App