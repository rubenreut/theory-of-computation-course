import React from 'react';
import styled from 'styled-components';
import WordCount from '../../components/WordCount';

const IntroductionContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
`;

const IntroHeading = styled.h2`
  margin-bottom: var(--spacing-md);
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

const Image = styled.img`
  width: 100%;
  max-width: 600px;
  margin: var(--spacing-lg) auto;
  display: block;
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const AutomataIntroduction = () => {
  // Content for the introduction
  const introductionText = `
    Finite automata are abstract computational models that represent a system with a finite number of 
    states. They are fundamental in computer science for their applications in lexical analysis, pattern matching,
    and verification systems.
    
    A finite automaton reads a sequence of symbols (an input string) and either accepts or rejects it. 
    The automaton processes one symbol at a time, transitioning between states according to a transition function.
    
    There are two primary types of finite automata:
    
    1. Deterministic Finite Automata (DFA): In a DFA, for each state and input symbol, there is exactly one next state.
    This makes the computation deterministic - given a specific input, the automaton will always follow the same path.
    
    2. Non-deterministic Finite Automata (NFA): An NFA can have multiple possible transitions for the same input symbol
    and state, or even transitions on the empty string (ε-transitions). The NFA accepts an input if there exists at least
    one path through the automaton that leads to an accepting state.
    
    Despite their differences in definition, both DFAs and NFAs recognize exactly the same set of languages - the regular
    languages. This means any NFA can be converted to an equivalent DFA, though the resulting DFA may have exponentially
    more states.
    
    Finite automata provide a theoretical foundation for regular expressions, which are widely used in text processing,
    lexical analysis in compilers, and pattern matching applications.
  `;

  return (
    <IntroductionContainer>
      <IntroHeading>Introduction to Finite Automata</IntroHeading>
      
      <StatsContainer>
        <WordCount text={introductionText} label="Introduction word count" />
      </StatsContainer>
      
      <ContentSection>
        <Paragraph>
          Finite automata are abstract computational models that represent a system with a finite number of 
          states. They are fundamental in computer science for their applications in lexical analysis, pattern matching,
          and verification systems.
        </Paragraph>
        
        <Paragraph>
          A finite automaton reads a sequence of symbols (an input string) and either accepts or rejects it. 
          The automaton processes one symbol at a time, transitioning between states according to a transition function.
        </Paragraph>
      </ContentSection>
      
      <ContentSection>
        <IntroHeading>Types of Finite Automata</IntroHeading>
        
        <Paragraph>
          <strong>Deterministic Finite Automata (DFA):</strong> In a DFA, for each state and input symbol, there is exactly one next state.
          This makes the computation deterministic - given a specific input, the automaton will always follow the same path.
        </Paragraph>
        
        <Paragraph>
          <strong>Non-deterministic Finite Automata (NFA):</strong> An NFA can have multiple possible transitions for the same input symbol
          and state, or even transitions on the empty string (epsilon-transitions). The NFA accepts an input if there exists at least
          one path through the automaton that leads to an accepting state.
        </Paragraph>
      </ContentSection>
      
      <ContentSection>
        <IntroHeading>Equivalence of DFAs and NFAs</IntroHeading>
        
        <Paragraph>
          Despite their differences in definition, both DFAs and NFAs recognize exactly the same set of languages - the regular
          languages. This means any NFA can be converted to an equivalent DFA, though the resulting DFA may have exponentially
          more states.
        </Paragraph>
        
        <Paragraph>
          Finite automata provide a theoretical foundation for regular expressions, which are widely used in text processing,
          lexical analysis in compilers, and pattern matching applications.
        </Paragraph>
      </ContentSection>
      
      <ContentSection>
        <IntroHeading>Formal Definition</IntroHeading>
        
        <Paragraph>
          A deterministic finite automaton (DFA) is a 5-tuple (Q, Σ, δ, q₀, F) where:
        </Paragraph>
        
        <ul>
          <li>Q is a finite set of states</li>
          <li>Σ is a finite set of input symbols called the alphabet</li>
          <li>δ is the transition function: Q × Σ → Q</li>
          <li>q₀ ∈ Q is the initial state</li>
          <li>F ⊆ Q is the set of accepting states</li>
        </ul>
        
        <Paragraph>
          A non-deterministic finite automaton (NFA) is also a 5-tuple (Q, Σ, δ, q₀, F), but with the transition function
          defined as δ: Q × (Σ ∪ {ε}) → P(Q), where P(Q) is the power set of Q (set of all subsets of Q).
        </Paragraph>
      </ContentSection>
    </IntroductionContainer>
  );
};

export default AutomataIntroduction;