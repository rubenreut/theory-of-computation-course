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
  padding: 20px 0;
`;

const ModuleHeader = styled.div`
  margin-bottom: 30px;
`;

const TabsNav = styled.nav`
  display: flex;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
`;

const TabLink = styled(NavLink)`
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  border-right: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background-color: #e9e9e9;
  }
  
  &.active {
    background-color: var(--primary-color);
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 576px) {
    padding: 8px 10px;
    font-size: 0.8rem;
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
        <h1>Context-Free Grammars</h1>
        <p>Learn and practice with Context-Free Grammars through interactive examples and visualizations.</p>
      </ModuleHeader>
      
      <TabsNav>
        <TabLink to="/cfg/introduction">Introduction</TabLink>
        <TabLink to="/cfg/editor">Grammar Editor</TabLink>
        <TabLink to="/cfg/examples">Examples</TabLink>
        <TabLink to="/cfg/comparisons">Comparisons</TabLink>
        <TabLink to="/cfg/cheatsheet">Cheat Sheet</TabLink>
      </TabsNav>
      
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
    </ModuleContainer>
  );
};

export default CFGModule;