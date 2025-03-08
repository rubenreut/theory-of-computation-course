import React from 'react';
import Explanation from '../../components/Explanation';
import WordCount from '../../components/WordCount';
import StepByStepAlgorithm from '../../components/StepByStepAlgorithm';
import GuidedExercise from '../../components/GuidedExercise';
import styled from 'styled-components';

const IntroductionContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
  font-size: var(--font-size-lg);
  line-height: 1.7;
`;

const IntroHeading = styled.h2`
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-xxl);
  font-weight: 700;
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: var(--spacing-lg);
`;

const ContentSection = styled.section`
  margin-bottom: var(--spacing-xl);
`;

const ExampleBox = styled.div`
  background-color: var(--surface-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  border: 2px solid var(--border-color);
  box-shadow: 0 4px 12px var(--shadow-color);
`;

const HighlightText = styled.span`
  background-color: rgba(255, 159, 10, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
`;

const CodeBlock = styled.pre`
  background-color: var(--background-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border-left: 6px solid var(--primary-color);
  overflow-x: auto;
  font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: var(--font-size-base);
  line-height: 1.6;
  margin: var(--spacing-md) 0;
`;

// eslint-disable-next-line no-unused-vars
const InlineCode = styled.code`
  font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.9em;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-md) 0;
  font-size: var(--font-size-base);
  
  th, td {
    border: 2px solid var(--border-color);
    padding: var(--spacing-md);
    text-align: left;
  }
  
  th {
    background-color: var(--background-color);
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const CFGIntroduction = () => {
  // We kept the original but enhanced content dramatically
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
  
  // Sample steps for the CYK algorithm visualization
  const cykSteps = [
    {
      title: "Initialize the CYK Table",
      description: "Create an n × n table where n is the length of the input string. Each cell (i,j) will contain the set of non-terminals that can derive the substring from position i to j."
    },
    {
      title: "Fill the Diagonal (Base Case)",
      description: "For each character in the input string, find all non-terminals that can derive it directly. These will be placed on the diagonal of the table."
    },
    {
      title: "Fill Upper Triangular Matrix",
      description: "For each cell (i,j), try all possible ways to split the substring. For each split point k, check if there are non-terminals A and B such that A derives substring i to k, B derives substring k+1 to j, and there's a rule C -> AB."
    },
    {
      title: "Check Acceptance",
      description: "The string is accepted if the start symbol is in the top-right cell of the table, which represents the entire input string."
    }
  ];
  
  // Visualization function for the CYK algorithm (simplified)
  const cykVisualization = (step) => {
    return (
      <div>
        <h4 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '10px' }}>CYK Parsing Table - Step {step + 1}</h4>
        
        <Table>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>CYK Table</th>
              <th>a</th>
              <th>b</th>
              <th>b</th>
              <th>a</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 'bold' }}>a</td>
              <td style={{ backgroundColor: step >= 0 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 0 ? '{A}' : ''}</td>
              <td style={{ backgroundColor: step >= 2 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 2 ? '{S}' : ''}</td>
              <td style={{ backgroundColor: step >= 2 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 2 ? '{B}' : ''}</td>
              <td style={{ backgroundColor: step >= 3 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 3 ? '{S}' : ''}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>b</td>
              <td>-</td>
              <td style={{ backgroundColor: step >= 0 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 0 ? '{B}' : ''}</td>
              <td style={{ backgroundColor: step >= 2 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 2 ? '{S}' : ''}</td>
              <td style={{ backgroundColor: step >= 3 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 3 ? '{C}' : ''}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>b</td>
              <td>-</td>
              <td>-</td>
              <td style={{ backgroundColor: step >= 0 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 0 ? '{B}' : ''}</td>
              <td style={{ backgroundColor: step >= 1 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 1 ? '{A}' : ''}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 'bold' }}>a</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td style={{ backgroundColor: step >= 0 ? 'rgba(0, 113, 227, 0.1)' : 'transparent' }}>{step >= 0 ? '{A}' : ''}</td>
            </tr>
          </tbody>
        </Table>
        
        <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', backgroundColor: 'rgba(52, 199, 89, 0.1)', borderRadius: 'var(--border-radius-md)' }}>
          <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Current Action:</p>
          <p>{cykSteps[step].description}</p>
        </div>
      </div>
    );
  };
  
  // Grammar recognition exercise user interface
  const exerciseInput = (
    <ExampleBox>
      <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>Given the grammar:</p>
      <CodeBlock>{`
  S => AB | BC
  A => BA | a
  B => CC | b
  C => AB | a
  `}</CodeBlock>
      <p style={{ fontSize: 'var(--font-size-lg)', marginTop: 'var(--spacing-md)' }}>Determine if the string "abba" is in the language defined by this grammar.</p>
      <div style={{ margin: 'var(--spacing-md) 0' }}>
        <textarea 
          placeholder="Write your answer here..." 
          style={{ 
            width: '100%', 
            height: '120px', 
            padding: 'var(--spacing-md)',
            fontSize: 'var(--font-size-base)',
            borderRadius: 'var(--border-radius-md)',
            border: '2px solid var(--border-color)'
          }}
        />
      </div>
    </ExampleBox>
  );
  
  return (
    <IntroductionContainer>
      <IntroHeading>Introduction to Context-Free Grammars</IntroHeading>
      
      <StatsContainer>
        <WordCount text={explanationText} label="Introduction word count" />
      </StatsContainer>
      
      <ContentSection>
        <p>
          Context-Free Grammars (CFGs) are a <HighlightText>formal way to describe the syntax of languages</HighlightText>. They are widely used in 
          computer science, particularly in the design of programming languages, parsing, and compiler construction.
        </p>
        
        <p>
          The power of context-free grammars lies in their ability to describe <HighlightText>recursive structures</HighlightText>, such as nested 
          parentheses or nested if-statements in programming languages, which cannot be described by regular expressions.
        </p>
        
        <ExampleBox>
          <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-md)' }}>Formal Definition</h3>
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>A context-free grammar G is defined by the 4-tuple G = (V, Σ, R, S), where:</p>
          <ul style={{ fontSize: 'var(--font-size-lg)', marginLeft: 'var(--spacing-lg)' }}>
            <li><strong>V</strong> is a finite set of non-terminal symbols</li>
            <li><strong>Σ</strong> is a finite set of terminal symbols (disjoint from V)</li>
            <li><strong>R</strong> is a finite set of production rules of the form A -&gt; α, where A ∈ V and α ∈ (V ∪ Σ)*</li>
            <li><strong>S</strong> is the start symbol (S ∈ V)</li>
          </ul>
          
          <h4 style={{ fontSize: 'var(--font-size-lg)', marginTop: 'var(--spacing-md)' }}>Example Grammar:</h4>
          <CodeBlock>{`V = {S, A, B}
Σ = {a, b}
R = {
  S => AB,
  S => aB,
  A => a,
  A => aS,
  B => b,
  B => bS
}
Start symbol = S`}
          </CodeBlock>
        </ExampleBox>
      </ContentSection>
      
      <ContentSection>
        <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-md)' }}>Parsing Algorithms for Context-Free Grammars</h3>
        <p>
          One of the key applications of CFGs is parsing - determining whether a string is in the language defined by
          the grammar, and if so, finding its structure according to the grammar rules.
        </p>
        
        <StepByStepAlgorithm 
          title="The CYK Parsing Algorithm" 
          steps={cykSteps}
          visualization={cykVisualization}
        />
      </ContentSection>
      
      <ContentSection>
        <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-md)' }}>Practice Your Understanding</h3>
        <GuidedExercise
          title="Grammar Recognition Exercise"
          difficulty="medium"
          description="Test your understanding of context-free grammars by solving this exercise. Use the CYK algorithm to determine if the string can be derived from the grammar."
          hint="Try constructing a CYK parse table. Start with individual characters in the diagonal, then work your way up to fill the entire table."
          solution={<div style={{ fontSize: 'var(--font-size-lg)' }}>The string "abba" <strong>is</strong> in the language. You can see this by constructing the CYK table and verifying that the start symbol S appears in the top-right cell.</div>}
          userComponents={exerciseInput}
          onCheck={() => true} // This would actually check the answer
          onNext={() => {}} // This would navigate to the next exercise
          exerciseNumber={1}
          totalExercises={5}
        />
      </ContentSection>
      
      <Explanation />
    </IntroductionContainer>
  );
};

export default CFGIntroduction;