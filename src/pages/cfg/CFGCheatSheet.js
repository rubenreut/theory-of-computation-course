import React from 'react';
import styled from 'styled-components';
import CheatSheet from '../../components/CheatSheet';

const CheatSheetContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CFGCheatSheet = () => {
  return (
    <CheatSheetContainer>
      <h2>Context-Free Grammar Cheat Sheet</h2>
      <p>Quick reference for context-free grammar notation, rules, and common patterns.</p>
      <CheatSheet />
    </CheatSheetContainer>
  );
};

export default CFGCheatSheet;