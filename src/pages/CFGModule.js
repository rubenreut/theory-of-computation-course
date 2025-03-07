import React, { useState } from 'react';
import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCFG } from '../context/CFGContext';
import useURLParams from '../hooks/useURLParams';

// Import sub-pages
import CFGIntroduction from './cfg/CFGIntroduction';
import CFGEditor from './cfg/CFGEditor';
import CFGExamples from './cfg/CFGExamples';
import CFGComparisons from './cfg/CFGComparisons';
import CFGCheatSheet from './cfg/CFGCheatSheet';

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
  background: linear-gradient(90deg, var(--primary-color), var(--tertiary-color));
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
    color: var(--primary-color);
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

const CFGModule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { grammar, setGrammar, inputString, setInputString } = useCFG();
  
  // Initialize URL params
  const { createShareableURL } = useURLParams({ 
    setGrammar, 
    setInputString 
  });
  
  // Redirect to the first tab if we're just at /cfg
  React.useEffect(() => {
    if (location.pathname === '/cfg') {
      navigate('/cfg/introduction');
    }
  }, [location, navigate]);

  return (
    <ModuleContainer className="cfg-module">
      <ModuleHeader>
        <ModuleTitle>Context-Free Grammars</ModuleTitle>
        <ModuleDescription>
          Learn and practice with context-free grammars through interactive examples and visualizations. Master the fundamentals of formal language theory.
        </ModuleDescription>
      </ModuleHeader>
      
      <TabsContainer>
        <TabsNav>
          <TabLink to="/cfg/introduction">Introduction</TabLink>
          <TabLink to="/cfg/editor">Grammar Editor</TabLink>
          <TabLink to="/cfg/examples">Examples</TabLink>
          <TabLink to="/cfg/comparisons">Comparisons</TabLink>
          <TabLink to="/cfg/cheatsheet">Cheat Sheet</TabLink>
        </TabsNav>
        
        <ContentContainer>
          <Routes>
            <Route path="/introduction" element={<CFGIntroduction />} />
            <Route path="/editor" element={
              <CFGEditor 
                grammar={grammar} 
                setGrammar={setGrammar} 
                inputString={inputString} 
                setInputString={setInputString}
                createShareableURL={createShareableURL}
              />
            } />
            <Route path="/examples" element={<CFGExamples />} />
            <Route path="/comparisons" element={<CFGComparisons />} />
            <Route path="/cheatsheet" element={<CFGCheatSheet />} />
          </Routes>
        </ContentContainer>
      </TabsContainer>
    </ModuleContainer>
  );
};

export default CFGModule;