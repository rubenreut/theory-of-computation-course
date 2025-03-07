import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import Home from './pages/Home';
import CFGModule from './pages/CFGModule';
import AutomataModule from './pages/AutomataModule';
import './styles/main.css';

// CSS for entire application
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background-color: var(--background-color);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color var(--transition-speed) ease, color var(--transition-speed) ease;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  
  @media (min-width: 1800px) {
    padding: var(--spacing-xl) var(--spacing-xxl);
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

function App() {
  return (
    <Router>
      <AppContainer className="full-container">
        <Navbar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cfg/*" element={<CFGModule />} />
            <Route path="/automata/*" element={<AutomataModule />} />
            {/* Add more module routes as the application grows */}
          </Routes>
        </MainContent>
        <Settings />
      </AppContainer>
    </Router>
  );
}

export default App;