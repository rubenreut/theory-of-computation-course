import React from 'react';
import styled from 'styled-components';

const CheatSheetContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
`;

const CheatSheetCard = styled.div`
  background-color: var(--surface-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
`;

const CardTitle = styled.h3`
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--secondary-color);
`;

const Definition = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const DefinitionTerm = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-color);
`;

const DefinitionDescription = styled.p`
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
`;

const Code = styled.pre`
  background-color: #f6f8fa;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  overflow-x: auto;
  font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
  margin-bottom: var(--spacing-md);
`;

const Algorithm = styled.div`
  background-color: rgba(52, 199, 89, 0.05);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border-left: 4px solid var(--secondary-color);
  margin-bottom: var(--spacing-lg);
`;

const AlgorithmTitle = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
`;

const AlgorithmSteps = styled.ol`
  padding-left: var(--spacing-xl);
  
  li {
    margin-bottom: var(--spacing-sm);
    line-height: 1.6;
  }
`;

const AutomataCheatSheet = () => {
  return (
    <CheatSheetContainer>
      <SectionTitle>Finite Automata Cheat Sheet</SectionTitle>
      
      <CheatSheetCard>
        <CardTitle>Definitions</CardTitle>
        
        <Definition>
          <DefinitionTerm>Deterministic Finite Automaton (DFA)</DefinitionTerm>
          <DefinitionDescription>
            A DFA is a 5-tuple (Q, Σ, δ, q₀, F) where:
          </DefinitionDescription>
          <ul>
            <li>Q is a finite set of states</li>
            <li>Σ is a finite set of input symbols (the alphabet)</li>
            <li>δ: Q × Σ → Q is the transition function</li>
            <li>q₀ ∈ Q is the initial state</li>
            <li>F ⊆ Q is the set of accepting states</li>
          </ul>
        </Definition>
        
        <Definition>
          <DefinitionTerm>Non-deterministic Finite Automaton (NFA)</DefinitionTerm>
          <DefinitionDescription>
            An NFA is also a 5-tuple (Q, Σ, δ, q₀, F) but with:
          </DefinitionDescription>
          <ul>
            <li>Q is a finite set of states</li>
            <li>Σ is a finite set of input symbols (the alphabet)</li>
            <li>δ: Q × (Σ ∪ {"ε"}) → P(Q) is the transition function (P(Q) is the power set of Q)</li>
            <li>q₀ ∈ Q is the initial state</li>
            <li>F ⊆ Q is the set of accepting states</li>
          </ul>
        </Definition>
        
        <Definition>
          <DefinitionTerm>Regular Language</DefinitionTerm>
          <DefinitionDescription>
            A language is regular if and only if it can be recognized by a finite automaton.
            Regular languages are closed under union, intersection, concatenation, and Kleene star operations.
          </DefinitionDescription>
        </Definition>
      </CheatSheetCard>
      
      <CheatSheetCard>
        <CardTitle>Algorithms</CardTitle>
        
        <Algorithm>
          <AlgorithmTitle>NFA to DFA Conversion (Powerset Construction)</AlgorithmTitle>
          <AlgorithmSteps>
            <li>Create a DFA where each state corresponds to a set of NFA states</li>
            <li>Start with the initial state of the DFA being the ε-closure of the NFA's initial state</li>
            <li>For each DFA state and input symbol, compute the next state by following all possible NFA transitions</li>
            <li>A DFA state is accepting if it contains at least one accepting NFA state</li>
            <li>Continue until no new DFA states are discovered</li>
          </AlgorithmSteps>
        </Algorithm>
        
        <Algorithm>
          <AlgorithmTitle>DFA Minimization (Hopcroft's Algorithm)</AlgorithmTitle>
          <AlgorithmSteps>
            <li>Partition the states into accepting and non-accepting states</li>
            <li>Iteratively refine the partition: Two states are equivalent if for each input symbol, they transition to states in the same partition</li>
            <li>Continue until no further refinement is possible</li>
            <li>Create a new DFA with one state for each partition</li>
          </AlgorithmSteps>
        </Algorithm>
      </CheatSheetCard>
      
      <CheatSheetCard>
        <CardTitle>Regular Expressions to DFA</CardTitle>
        <Definition>
          <DefinitionTerm>Regular Expression Operators</DefinitionTerm>
          <Code>
            Union: a|b       (matches a or b)
            Concatenation: ab (matches a followed by b)
            Kleene Star: a*   (matches zero or more a's)
            Parentheses: (a)  (used for grouping)
            One or more: a+   (matches one or more a's, equivalent to aa*)
            Optional: a?      (matches zero or one a, equivalent to (ε|a) where ε is the empty string)
          </Code>
        </Definition>
        
        <Algorithm>
          <AlgorithmTitle>Thompson's Construction</AlgorithmTitle>
          <DefinitionDescription>
            Thompson's construction converts a regular expression to an NFA:
          </DefinitionDescription>
          <AlgorithmSteps>
            <li>For each basic regular expression operator, construct a corresponding NFA fragment</li>
            <li>Combine these fragments according to the structure of the regular expression</li>
            <li>Convert the resulting NFA to a DFA using the powerset construction</li>
          </AlgorithmSteps>
        </Algorithm>
      </CheatSheetCard>
      
      <CheatSheetCard>
        <CardTitle>Common Regular Languages Examples</CardTitle>
        
        <Definition>
          <DefinitionTerm>Strings with an even number of 0's</DefinitionTerm>
          <DefinitionDescription>
            Regular Expression: (1*(01*01*)*) 
          </DefinitionDescription>
        </Definition>
        
        <Definition>
          <DefinitionTerm>Strings ending with a specific pattern (e.g., "01")</DefinitionTerm>
          <DefinitionDescription>
            Regular Expression: (0|1)*01
          </DefinitionDescription>
        </Definition>
        
        <Definition>
          <DefinitionTerm>Strings where each 0 is followed by at least one 1</DefinitionTerm>
          <DefinitionDescription>
            Regular Expression: (1*(01+)*)
          </DefinitionDescription>
        </Definition>
      </CheatSheetCard>
    </CheatSheetContainer>
  );
};

export default AutomataCheatSheet;