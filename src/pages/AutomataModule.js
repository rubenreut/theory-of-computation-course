import React from 'react';
import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Import sub-pages
import AutomataIntroduction from './automata/AutomataIntroduction';
// Temporarily removed: import DFAEditor from './automata/DFAEditor';
// Temporarily removed: import NFAEditor from './automata/NFAEditor';
import AutomataExamples from './automata/AutomataExamples';
import AutomataComparisons from './automata/AutomataComparisons';
import AutomataCheatSheet from './automata/AutomataCheatSheet';

const ModuleContainer = styled.div`
  width: 100%;
`;

const ModuleHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  max-width: 800px;
`;

const ModuleTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  background: linear-gradient(90deg, var(--secondary-color), var(--tertiary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ModuleDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary);
`;

const TabsContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  width: 100%;
`;

const TabsNav = styled.nav`
  display: inline-flex;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: 4px;
  margin-bottom: var(--spacing-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  }
`;

const TabLink = styled(NavLink)`
  padding: 10px 20px;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 16px;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.active {
    background-color: white;
    color: var(--secondary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

const ContentContainer = styled.div`
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 30px var(--shadow-color);
  padding: var(--spacing-xxl);
  margin-bottom: var(--spacing-xxl);
  border: 1px solid var(--border-color);
  width: 100%;
  animation: fadeIn 0.3s ease-in-out;
  font-size: var(--font-size-lg);
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  & > * {
    max-width: 100%;
  }
  
  & h2 {
    font-size: calc(var(--font-size-xxl) + 2px);
    margin-bottom: var(--spacing-lg);
  }
  
  & h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }
  
  & p {
    margin-bottom: var(--spacing-lg);
    font-size: var(--font-size-lg);
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-md);
  }
`;

const AutomataModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect to the first tab if we're just at /automata
  React.useEffect(() => {
    if (location.pathname === '/automata') {
      navigate('/automata/introduction');
    }
  }, [location, navigate]);

  return (
    <ModuleContainer className="automata-module">
      <ModuleHeader>
        <ModuleTitle>Finite Automata</ModuleTitle>
        <ModuleDescription>
          Learn about Deterministic and Non-deterministic Finite Automata, their properties, 
          and how they relate to regular languages through interactive examples and simulations.
        </ModuleDescription>
      </ModuleHeader>
      
      <TabsContainer>
        <TabsNav>
          <TabLink to="/automata/introduction">Introduction</TabLink>
          <TabLink to="/automata/dfa">DFA Editor</TabLink>
          <TabLink to="/automata/nfa">NFA Editor</TabLink>
          <TabLink to="/automata/examples">Examples</TabLink>
          <TabLink to="/automata/comparisons">Comparisons</TabLink>
          <TabLink to="/automata/cheatsheet">Cheat Sheet</TabLink>
        </TabsNav>
        
        <ContentContainer>
          <Routes>
            <Route path="/introduction" element={<AutomataIntroduction />} />
            <Route path="/dfa" element={<div>DFA Editor under refactoring</div>} />
            <Route path="/nfa" element={<div>NFA Editor under refactoring</div>} />
            <Route path="/examples" element={<AutomataExamples />} />
            <Route path="/comparisons" element={<AutomataComparisons />} />
            <Route path="/cheatsheet" element={<AutomataCheatSheet />} />
          </Routes>
        </ContentContainer>
      </TabsContainer>
    </ModuleContainer>
  );
};

export default AutomataModule;