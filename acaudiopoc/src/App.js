import React from 'react';
import logo from './logo.svg';
import './App.css';
import { PodcastPlayer } from './PodcastPlayer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <code>AgentConnect</code> podcast POC.
        </p>
        <img src={logo} className="App-logo" alt="logo" />

      </header>
      <PodcastPlayer />
    </div>
  );
}

export default App;
