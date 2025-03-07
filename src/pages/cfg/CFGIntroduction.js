import React from 'react';
import Explanation from '../../components/Explanation';
import WordCount from '../../components/WordCount';
import styled from 'styled-components';

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

const CFGIntroduction = () => {
  // This is a simple text to demonstrate word counting functionality
  const explanationText = `
    Context-Free Grammars (CFGs) are a formal grammar used in computer science to describe the syntax of languages.
    They're particularly important in parsing programming languages, natural language processing, and compilers.
    A CFG consists of a set of production rules that describe all possible strings in a given language.
    The term "context-free" refers to the fact that each production rule replaces a single non-terminal symbol
    independent of its surrounding context.
    
    A CFG is defined by four components:
    - A set of terminal symbols (the alphabet of the language)
    - A set of non-terminal symbols (variables that can be replaced)
    - A set of production rules
    - A start symbol
    
    CFGs are more powerful than regular expressions and can describe nested structures like balanced parentheses,
    which is why they're used for programming languages where nesting is common.
  `;
  
  return (
    <IntroductionContainer>
      <IntroHeading>Introduction to Context-Free Grammars</IntroHeading>
      
      <StatsContainer>
        <WordCount text={explanationText} label="Introduction word count" />
      </StatsContainer>
      
      <Explanation />
    </IntroductionContainer>
  );
};

export default CFGIntroduction;