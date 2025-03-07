import React from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-color);
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 700px;
`;

const ComingSoonContainer = styled.div`
  text-align: center;
  padding: var(--spacing-xxl);
  background-color: rgba(94, 92, 230, 0.05);
  border-radius: var(--border-radius-lg);
  border: 1px dashed rgba(94, 92, 230, 0.3);
`;

const ComingSoonIcon = styled.div`
  font-size: 4rem;
  color: var(--tertiary-color);
  margin-bottom: var(--spacing-md);
`;

const ComingSoonText = styled.h3`
  font-size: var(--font-size-xl);
  color: var(--tertiary-color);
  margin-bottom: var(--spacing-md);
`;

const ComingSoonDescription = styled.p`
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const NFAEditor = () => {
  return (
    <EditorContainer>
      <SectionTitle>Non-deterministic Finite Automaton (NFA) Editor</SectionTitle>
      <SectionDescription>
        Create and test your own NFA with this interactive editor. Define states, alphabet, 
        transitions (including epsilon-transitions), and test input strings.
      </SectionDescription>
      
      <ComingSoonContainer>
        <ComingSoonIcon>🚧</ComingSoonIcon>
        <ComingSoonText>Coming Soon</ComingSoonText>
        <ComingSoonDescription>
          We're currently working on the NFA Editor. It will include support for multiple transitions 
          on the same input symbol and epsilon-transitions. Check back soon!
        </ComingSoonDescription>
      </ComingSoonContainer>
    </EditorContainer>
  );
};

export default NFAEditor;