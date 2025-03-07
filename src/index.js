import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CFGProvider from './context/CFGContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CFGProvider>
      <App />
    </CFGProvider>
  </React.StrictMode>
);