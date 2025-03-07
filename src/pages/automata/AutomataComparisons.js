import React from 'react';
import styled from 'styled-components';
import WordCount from '../../components/WordCount';

const ComparisonsContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: var(--spacing-lg);
`;

const ContentSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Paragraph = styled.p`
  margin-bottom: var(--spacing-md);
  line-height: 1.7;
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-lg) 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  
  th, td {
    border: 1px solid var(--border-color);
    padding: 12px 15px;
    text-align: left;
  }
  
  th {
    background-color: var(--secondary-color);
    color: white;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  tr:hover {
    background-color: rgba(52, 199, 89, 0.05);
  }
`;

const AutomataComparisons = () => {
  const comparisonText = `
    Finite automata come in different variants, each with its own capabilities and limitations. The two main types
    are Deterministic Finite Automata (DFA) and Non-deterministic Finite Automata (NFA). While they differ in 
    definition and structure, they actually have the same computational power - they can recognize exactly the same
    set of languages (the regular languages).
    
    DFAs are simpler to understand and implement because at each step there is exactly one possible transition
    for each input symbol. NFAs, on the other hand, can have multiple possible transitions for the same symbol,
    or even transitions on the empty string (ε-transitions). This non-determinism doesn't give NFAs more power,
    but it often allows for more concise representations of certain languages.
    
    Any NFA can be converted to an equivalent DFA using the powerset construction algorithm, though the resulting
    DFA may have exponentially more states. Despite this potential size increase, DFAs are generally more
    efficient for parsing at runtime since they don't require backtracking or parallel state exploration.
    
    Both DFAs and NFAs are limited to recognizing regular languages. They cannot recognize context-free languages
    or more complex language classes. For example, they cannot recognize languages like balanced parentheses or
    palindromes, which require some form of memory or counting.
    
    More powerful models like pushdown automata (which add a stack) can recognize context-free languages, while
    Turing machines can recognize recursively enumerable languages, the broadest class in the Chomsky hierarchy.
  `;
  
  return (
    <ComparisonsContainer>
      <SectionTitle>Finite Automata Comparisons</SectionTitle>
      
      <StatsContainer>
        <WordCount text={comparisonText} label="Comparison text word count" />
      </StatsContainer>
      
      <ContentSection>
        <Paragraph>
          Finite automata come in different variants, each with its own capabilities and limitations. The two main types
          are Deterministic Finite Automata (DFA) and Non-deterministic Finite Automata (NFA). While they differ in 
          definition and structure, they actually have the same computational power - they can recognize exactly the same
          set of languages (the regular languages).
        </Paragraph>
        
        <Paragraph>
          DFAs are simpler to understand and implement because at each step there is exactly one possible transition
          for each input symbol. NFAs, on the other hand, can have multiple possible transitions for the same symbol,
          or even transitions on the empty string (ε-transitions). This non-determinism doesn't give NFAs more power,
          but it often allows for more concise representations of certain languages.
        </Paragraph>
      </ContentSection>
      
      <ContentSection>
        <SectionTitle>Side-by-Side Comparison</SectionTitle>
        
        <ComparisonTable>
          <thead>
            <tr>
              <th>Feature</th>
              <th>DFA</th>
              <th>NFA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Transitions per symbol</td>
              <td>Exactly one</td>
              <td>Zero or more</td>
            </tr>
            <tr>
              <td>ε-transitions</td>
              <td>Not allowed</td>
              <td>Allowed</td>
            </tr>
            <tr>
              <td>Implementation complexity</td>
              <td>Simple</td>
              <td>More complex (requires backtracking or parallel states)</td>
            </tr>
            <tr>
              <td>State complexity</td>
              <td>May require more states</td>
              <td>Often more concise representation</td>
            </tr>
            <tr>
              <td>Conversion</td>
              <td>Trivial (DFA is already an NFA)</td>
              <td>Powerset construction (can lead to 2^n states)</td>
            </tr>
            <tr>
              <td>Language recognition power</td>
              <td>Regular languages</td>
              <td>Regular languages</td>
            </tr>
            <tr>
              <td>Runtime efficiency</td>
              <td>O(n) where n is input length</td>
              <td>O(n³) naively, O(n) with optimization</td>
            </tr>
          </tbody>
        </ComparisonTable>
      </ContentSection>
      
      <ContentSection>
        <Paragraph>
          Any NFA can be converted to an equivalent DFA using the powerset construction algorithm, though the resulting
          DFA may have exponentially more states. Despite this potential size increase, DFAs are generally more
          efficient for parsing at runtime since they don't require backtracking or parallel state exploration.
        </Paragraph>
        
        <Paragraph>
          Both DFAs and NFAs are limited to recognizing regular languages. They cannot recognize context-free languages
          or more complex language classes. For example, they cannot recognize languages like balanced parentheses or
          palindromes, which require some form of memory or counting.
        </Paragraph>
        
        <Paragraph>
          More powerful models like pushdown automata (which add a stack) can recognize context-free languages, while
          Turing machines can recognize recursively enumerable languages, the broadest class in the Chomsky hierarchy.
        </Paragraph>
      </ContentSection>
    </ComparisonsContainer>
  );
};

export default AutomataComparisons;