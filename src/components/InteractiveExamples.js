import React from 'react';
import styled from 'styled-components';
import InteractiveExample from './InteractiveExample';

const ExamplesContainer = styled.div`
  margin: 30px 0;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const IntroText = styled.p`
  margin-bottom: 30px;
  line-height: 1.6;
`;

function InteractiveExamples() {
  // Example 1: Identifying Terminals and Non-terminals
  const symbolsExample = {
    title: "Identifying Grammar Symbols",
    description: "Practice identifying terminals and non-terminals in a context-free grammar.",
    steps: [
      {
        prompt: "Given the grammar G = (V, Σ, R, S) where V = {S, A, B}, Σ = {a, b, c}, identify all terminal symbols:",
        initialInput: "",
        placeholder: "Enter terminals separated by commas (e.g., a,b,c)",
        hint: "Terminal symbols are the basic building blocks that cannot be substituted further. They form the alphabet of the language.",
        explanation: "Terminal symbols are the actual characters that appear in the strings of the language. They cannot be replaced by production rules. In this grammar, the terminals are a, b, and c.",
        validator: (input) => {
          const answer = input.toLowerCase().replace(/\s+/g, '');
          const correctAnswer = "a,b,c";
          
          if (answer === correctAnswer) {
            return { 
              message: "Correct! The terminal symbols are a, b, and c.", 
              status: "success" 
            };
          } else {
            return { 
              message: "Not quite right. Remember, terminals are the symbols that cannot be replaced further.", 
              status: "error" 
            };
          }
        }
      },
      {
        prompt: "Now identify all non-terminal symbols from the same grammar:",
        initialInput: "",
        placeholder: "Enter non-terminals separated by commas (e.g., S,A,B)",
        hint: "Non-terminal symbols can be replaced by other symbols using the grammar's production rules.",
        explanation: "Non-terminal symbols are variables that can be replaced by sequences of terminals and non-terminals. They represent syntactic categories. In this grammar, the non-terminals are S, A, and B.",
        validator: (input) => {
          const answer = input.toUpperCase().replace(/\s+/g, '');
          const correctAnswer = "S,A,B";
          
          if (answer === correctAnswer) {
            return { 
              message: "Correct! The non-terminal symbols are S, A, and B.", 
              status: "success" 
            };
          } else {
            return { 
              message: "Not quite right. Non-terminals are the symbols that can be replaced by production rules.", 
              status: "error" 
            };
          }
        }
      }
    ]
  };
  
  // Example 2: Deriving strings from a grammar
  const derivationExample = {
    title: "String Derivation",
    description: "Practice deriving strings from a context-free grammar using production rules.",
    steps: [
      {
        prompt: "Consider the grammar with rules: S → AB, A → aA | a, B → bB | b. What is the leftmost derivation for the string 'aabb'?",
        initialInput: "",
        placeholder: "Enter each step separated by semicolons (e.g., S;AB;...)",
        hint: "In a leftmost derivation, always replace the leftmost non-terminal first. Start with S and apply rules step by step.",
        explanation: "A leftmost derivation always replaces the leftmost non-terminal at each step. For 'aabb', we start with S, then replace S with AB, then replace A with aA, then A with a, then B with bB, and finally B with b.",
        validator: (input) => {
          const answer = input.replace(/\s+/g, '');
          const correctAnswer = "S;AB;aAB;aaB;aabB;aabb";
          
          if (answer === correctAnswer) {
            return { 
              message: "Correct! You've successfully derived 'aabb' using a leftmost derivation.", 
              status: "success" 
            };
          } else {
            return { 
              message: "Not quite right. Remember to always replace the leftmost non-terminal at each step.", 
              status: "error" 
            };
          }
        }
      }
    ]
  };
  
  // Example 3: Testing membership in a CFL
  const membershipExample = {
    title: "Language Membership",
    description: "Determine whether a string belongs to a context-free language.",
    steps: [
      {
        prompt: "For the language L = {a^n b^n | n ≥ 1} (equal numbers of a's followed by b's), which of these strings are in the language?",
        initialInput: "",
        placeholder: "Enter valid strings separated by commas (e.g., ab,aabb)",
        hint: "Check if each string has an equal number of a's followed by b's, with no a's after any b's.",
        explanation: "The language L = {a^n b^n | n ≥ 1} contains strings with n a's followed by exactly n b's, where n is at least 1. For example, 'ab', 'aabb', 'aaabbb' are all in this language.",
        validator: (input) => {
          const answer = input.replace(/\s+/g, '').toLowerCase().split(',').sort().join(',');
          const correctAnswers = ["ab", "aabb", "aaabbb", "aaaabbbb", "aaaaabbbbb"];
          const correctAnswerString = correctAnswers.join(',');
          
          // Check if the answer contains all correct answers and no incorrect ones
          const userAnswers = answer.split(',');
          const allCorrect = userAnswers.every(str => {
            // Check if it matches a^n b^n pattern
            const aCount = (str.match(/a/g) || []).length;
            const bCount = (str.match(/b/g) || []).length;
            const validFormat = /^a+b+$/.test(str);
            
            return validFormat && aCount === bCount && aCount >= 1;
          });
          
          if (allCorrect && userAnswers.length > 0) {
            return { 
              message: "Correct! All the strings you identified follow the pattern a^n b^n where n ≥ 1.", 
              status: "success" 
            };
          } else {
            return { 
              message: "Not quite right. Make sure each string has exactly the same number of a's followed by b's.", 
              status: "error" 
            };
          }
        }
      }
    ]
  };
  
  // Example 4: Converting to Chomsky Normal Form
  const cnfExample = {
    title: "Chomsky Normal Form Conversion",
    description: "Convert a simple context-free grammar to Chomsky Normal Form (CNF).",
    steps: [
      {
        prompt: "Convert the production rule S → ABc to CNF format:",
        initialInput: "",
        placeholder: "Enter the new rules separated by commas (e.g., S→AB,A→a)",
        hint: "In CNF, rules must be of the form A → BC or A → a. You'll need to introduce a new non-terminal for the terminal 'c'.",
        explanation: "To convert S → ABc to CNF, we need to replace the terminal 'c' with a new non-terminal, say X, and add a rule X → c. So the rules become S → ABX and X → c.",
        validator: (input) => {
          const answer = input.replace(/\s+/g, '').toLowerCase();
          // Allow variations in naming the new non-terminal
          if (/s→ab[a-z],([a-z])→c/.test(answer) || /s→[a-z]b,([a-z])→a,([a-z])→c/.test(answer)) {
            return { 
              message: "Correct! You've successfully converted the rule to CNF format.", 
              status: "success" 
            };
          } else {
            return { 
              message: "Not quite right. Remember, in CNF, rules must be of the form A → BC or A → a.", 
              status: "error" 
            };
          }
        }
      }
    ]
  };
  
  // Example 5: First and Follow Sets
  const firstFollowExample = {
    title: "Computing First and Follow Sets",
    description: "Practice computing First sets for grammar symbols.",
    steps: [
      {
        prompt: "For the grammar S → AB, A → a | ε, B → b, what is FIRST(S)?",
        initialInput: "",
        placeholder: "Enter symbols separated by commas (e.g., a,b)",
        hint: "FIRST(S) includes all terminals that can appear first in any string derived from S. If A can derive ε, then FIRST(B) is also included in FIRST(S).",
        explanation: "For a non-terminal X, FIRST(X) is the set of terminals that can appear as the first symbol of any string derived from X. Since S → AB and A can derive both 'a' and ε, FIRST(S) = {a} ∪ FIRST(B) = {a, b}.",
        validator: (input) => {
          const answer = input.replace(/\s+/g, '').toLowerCase();
          const correctAnswer = "a,b";
          
          if (answer === correctAnswer || answer === "b,a") {
            return { 
              message: "Correct! FIRST(S) = {a, b} because A can derive ε, so FIRST(B) is also included.", 
              status: "success" 
            };
          } else {
            return { 
              message: "Not quite right. Consider what happens when A derives ε.", 
              status: "error" 
            };
          }
        }
      }
    ]
  };
  
  return (
    <ExamplesContainer>
      <Title>Interactive Exercises</Title>
      
      <IntroText>
        Test your understanding of context-free grammars with these interactive exercises. 
        Each exercise focuses on a different aspect of CFGs and provides immediate feedback.
      </IntroText>
      
      <InteractiveExample {...symbolsExample} />
      <InteractiveExample {...derivationExample} />
      <InteractiveExample {...membershipExample} />
      <InteractiveExample {...cnfExample} />
      <InteractiveExample {...firstFollowExample} />
    </ExamplesContainer>
  );
}

export default InteractiveExamples;