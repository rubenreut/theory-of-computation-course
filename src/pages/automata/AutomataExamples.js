import React from 'react';
import styled from 'styled-components';

const ExamplesContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
`;

const ExampleCard = styled.div`
  background-color: var(--surface-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
`;

const ExampleTitle = styled.h3`
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: var(--secondary-color);
    border-radius: 50%;
    margin-right: 10px;
  }
`;

const ExampleDescription = styled.p`
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
`;

const ComingSoonMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  background-color: rgba(52, 199, 89, 0.05);
  border-radius: var(--border-radius-md);
  margin-top: var(--spacing-lg);
  border: 1px dashed rgba(52, 199, 89, 0.3);
`;

const AutomataExamples = () => {
  return (
    <ExamplesContainer>
      <SectionTitle>Finite Automata Examples</SectionTitle>
      
      <ExampleCard>
        <ExampleTitle>Binary Strings with Even Number of 1's</ExampleTitle>
        <ExampleDescription>
          This DFA recognizes binary strings containing an even number of 1's (including zero 1's).
          This is a classic example that shows how finite automata can be used to recognize
          languages that count modulo some number.
        </ExampleDescription>
        
        <ComingSoonMessage>
          Interactive example coming soon! This will include a visual representation of the automaton,
          step-by-step execution for sample inputs, and the ability to test your own strings.
        </ComingSoonMessage>
      </ExampleCard>
      
      <ExampleCard>
        <ExampleTitle>Binary Strings Ending with '01'</ExampleTitle>
        <ExampleDescription>
          This DFA recognizes all binary strings that end with the pattern '01'. It demonstrates
          how finite automata can be used to recognize pattern-based languages.
        </ExampleDescription>
        
        <ComingSoonMessage>
          Interactive example coming soon! This will include a visual representation of the automaton,
          step-by-step execution for sample inputs, and the ability to test your own strings.
        </ComingSoonMessage>
      </ExampleCard>
      
      <ExampleCard>
        <ExampleTitle>Binary Strings with Equal Number of 0's and 1's</ExampleTitle>
        <ExampleDescription>
          This example explores the limitations of finite automata. While a DFA cannot recognize
          strings with an equal number of 0's and 1's (this requires a context-free grammar), 
          we can create a DFA that works for a bounded number of symbols.
        </ExampleDescription>
        
        <ComingSoonMessage>
          Interactive example coming soon! This will include a visual representation of the automaton,
          step-by-step execution for sample inputs, and the ability to test your own strings.
        </ComingSoonMessage>
      </ExampleCard>
    </ExamplesContainer>
  );
};

export default AutomataExamples;