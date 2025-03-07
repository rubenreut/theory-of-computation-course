import React from 'react';
import styled from 'styled-components';
import InteractiveExamples from '../../components/InteractiveExamples';

const ExamplesContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const CFGExamples = () => {
  return (
    <ExamplesContainer>
      <h2>Interactive Examples</h2>
      <p>Explore different types of context-free grammars with these interactive examples.</p>
      <InteractiveExamples />
    </ExamplesContainer>
  );
};

export default CFGExamples;