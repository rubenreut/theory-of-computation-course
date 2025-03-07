import React from 'react';
import styled from 'styled-components';
import VisualComparison from './VisualComparison';

const ComparisonsContainer = styled.div`
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

function VisualComparisons() {
  // Comparison 1: CFG vs Regular Grammar
  const cfgVsRegularComparison = {
    title: "Context-Free Grammar vs Regular Grammar",
    description: "Understanding the differences in expressive power and structure between context-free and regular grammars.",
    columns: [
      {
        title: "Context-Free Grammar",
        icon: "🌳",
        color: "#4caf50",
        list: [
          "Can have <strong>any single non-terminal</strong> on the left side of a production rule",
          "Production rules have the form <code>A → α</code> where A is a non-terminal and α is any string of terminals and non-terminals",
          "Can represent <strong>nested structures</strong> like balanced parentheses or nested HTML tags",
          "Can express languages like <code>{a<sup>n</sup>b<sup>n</sup> | n ≥ 0}</code> (equal numbers of a's and b's)",
          "Recognized by <strong>pushdown automata</strong> (finite automata with a stack)",
          "Used for programming language syntax and natural language parsing"
        ],
        code: "// Example CFG for balanced parentheses\nS → (S) | SS | ε"
      },
      {
        title: "Regular Grammar",
        icon: "🔄",
        color: "#2196f3",
        list: [
          "Production rules must have the form <code>A → aB</code>, <code>A → a</code>, or <code>A → ε</code>",
          "Right side can only have a terminal optionally followed by a single non-terminal",
          "Cannot represent nested or recursive structures",
          "Can express languages like <code>{a<sup>n</sup>b<sup>m</sup> | n,m ≥ 0}</code> (any number of a's followed by any number of b's)",
          "Recognized by <strong>finite automata</strong> (without a stack)",
          "Used for lexical analysis, pattern matching, and simple protocols"
        ],
        code: "// Example regular grammar for strings ending with 'ab'\nS → aS | bS | aA\nA → b"
      }
    ],
    footer: "Context-free grammars are strictly more powerful than regular grammars. Every regular language can be described by a context-free grammar, but not vice versa."
  };
  
  // Comparison 2: Derivation Types
  const derivationComparison = {
    title: "Leftmost vs Rightmost Derivation",
    description: "Comparing the two main approaches to derivation in context-free grammars.",
    columns: [
      {
        title: "Leftmost Derivation",
        icon: "⬅️",
        color: "#ff9800",
        list: [
          "Always replaces the <strong>leftmost non-terminal</strong> in the sentential form",
          "Used in <strong>top-down parsing</strong> methods like LL parsing",
          "Corresponds to a pre-order traversal of the parse tree",
          "Syntax: <code>S ⇒<sub>lm</sub> α</code>"
        ],
        code: "// Grammar: S → AB, A → aA | a, B → bB | b\n// Leftmost derivation of 'aabb':\nS ⇒ AB\n  ⇒ aAB     (replace A, the leftmost non-terminal)\n  ⇒ aaB     (replace A, the leftmost non-terminal)\n  ⇒ aabB    (replace B, the leftmost non-terminal)\n  ⇒ aabb    (replace B, the leftmost non-terminal)"
      },
      {
        title: "Rightmost Derivation",
        icon: "➡️",
        color: "#e91e63",
        list: [
          "Always replaces the <strong>rightmost non-terminal</strong> in the sentential form",
          "Used in <strong>bottom-up parsing</strong> methods like LR parsing",
          "Corresponds to a post-order traversal of the parse tree",
          "Syntax: <code>S ⇒<sub>rm</sub> α</code>"
        ],
        code: "// Grammar: S → AB, A → aA | a, B → bB | b\n// Rightmost derivation of 'aabb':\nS ⇒ AB\n  ⇒ AbB     (replace B, the rightmost non-terminal)\n  ⇒ Abb     (replace B, the rightmost non-terminal)\n  ⇒ aAbb    (replace A, the rightmost non-terminal)\n  ⇒ aabb    (replace A, the rightmost non-terminal)"
      }
    ],
    footer: "Both derivation types generate the same language but follow different paths. If a grammar is ambiguous, a string may have more than one leftmost or rightmost derivation."
  };
  
  // Comparison 3: Normal Forms
  const normalFormsComparison = {
    title: "Chomsky Normal Form vs Greibach Normal Form",
    description: "The two main standardized forms for context-free grammars.",
    columns: [
      {
        title: "Chomsky Normal Form (CNF)",
        icon: "🔤",
        color: "#9c27b0",
        list: [
          "All production rules have the form <code>A → BC</code> or <code>A → a</code>",
          "Only exception: <code>S → ε</code> is allowed if S is the start symbol",
          "Used in the CYK parsing algorithm",
          "Easier to implement for dynamic programming approaches",
          "Any CFG can be converted to an equivalent grammar in CNF"
        ],
        code: "// Example grammar in CNF\nS → AB | BC\nA → BA | a\nB → CC | b\nC → c"
      },
      {
        title: "Greibach Normal Form (GNF)",
        icon: "📝",
        color: "#00bcd4",
        list: [
          "All production rules have the form <code>A → aα</code> where a is a terminal and α is a string of non-terminals",
          "The right side always starts with exactly one terminal",
          "Used in certain theoretical proofs",
          "Natural for top-down parsing with backtracking",
          "Any CFG without ε-productions can be converted to GNF"
        ],
        code: "// Example grammar in GNF\nS → aAB | bBA\nA → aS | b\nB → bS | a"
      }
    ],
    footer: "Both normal forms preserve the language generated by the original grammar but standardize the structure of production rules."
  };
  
  // Comparison 4: Parsing Algorithms
  const parsingAlgorithmsComparison = {
    title: "Top-Down vs Bottom-Up Parsing",
    description: "Comparing the two fundamental approaches to parsing context-free languages.",
    columns: [
      {
        title: "Top-Down Parsing",
        icon: "↘️",
        color: "#3f51b5",
        list: [
          "Starts from the <strong>start symbol</strong> and tries to derive the input string",
          "Constructs the parse tree from the <strong>root down to the leaves</strong>",
          "Uses <strong>leftmost derivation</strong>",
          "Examples: Recursive descent parsing, LL parsing",
          "Cannot handle left recursion directly",
          "Usually implemented with a stack or recursive functions",
          "Predictive parsing uses lookahead to avoid backtracking"
        ]
      },
      {
        title: "Bottom-Up Parsing",
        icon: "↗️",
        color: "#f44336",
        list: [
          "Starts from the <strong>input string</strong> and tries to reduce it to the start symbol",
          "Constructs the parse tree from the <strong>leaves up to the root</strong>",
          "Creates a <strong>rightmost derivation in reverse</strong>",
          "Examples: Shift-reduce parsing, LR parsing, LALR parsing",
          "Can handle left recursion and more complex grammars",
          "Typically uses a stack and tables for actions and gotos",
          "More powerful but more complex to implement by hand"
        ]
      }
    ],
    footer: "Each approach has its strengths and weaknesses. Bottom-up parsers are generally more powerful, while top-down parsers are often easier to understand and implement."
  };
  
  // Comparison 5: What is/isn't CFG
  const cfgExamplesComparison = {
    title: "What is vs What isn't a Context-Free Language",
    description: "Examples of languages that are context-free and those that require more expressive power.",
    vertical: true,
    columns: [
      {
        title: "Context-Free Languages (Examples)",
        icon: "✅",
        color: "#4caf50",
        list: [
          "<code>{a<sup>n</sup>b<sup>n</sup> | n ≥ 0}</code> - Equal numbers of a's followed by b's",
          "<code>{ww<sup>R</sup> | w ∈ {a,b}*}</code> - Palindromes over {a,b}",
          "<code>{a<sup>n</sup>b<sup>m</sup>c<sup>m</sup>d<sup>n</sup> | n,m ≥ 0}</code> - Nested dependencies with two pairs",
          "Balanced parentheses, possibly nested: <code>{(, ), [, ], {, }}</code>",
          "Well-formed arithmetic expressions, e.g., <code>a+(b*c)</code>",
          "Most programming language constructs (if-then-else, loops, function calls)"
        ],
        code: "// Grammar for a^n b^n:\nS → aSb | ε\n\n// Grammar for palindromes:\nS → aSa | bSb | a | b | ε"
      },
      {
        title: "Non-Context-Free Languages (Examples)",
        icon: "❌",
        color: "#f44336",
        list: [
          "<code>{a<sup>n</sup>b<sup>n</sup>c<sup>n</sup> | n ≥ 0}</code> - Equal numbers of a's, b's, and c's",
          "<code>{ww | w ∈ {a,b}*}</code> - Exact string repetition (not reversed)",
          "<code>{a<sup>i</sup>b<sup>j</sup>c<sup>k</sup> | i = j or j = k}</code> - Language requiring logical OR between constraints",
          "Languages requiring counting beyond two types (proved using pumping lemma)",
          "Languages requiring cross-serial dependencies",
          "Most semantic checks in programming languages (type checking, variable scoping)"
        ],
        code: "// These patterns cannot be represented by any CFG\n// They require context-sensitive grammars or more\n// powerful formalisms"
      }
    ],
    footer: "The pumping lemma for context-free languages can be used to prove that a language is not context-free."
  };
  
  return (
    <ComparisonsContainer>
      <Title>Visual Comparisons</Title>
      
      <IntroText>
        These visual comparisons highlight key differences between related concepts 
        in context-free grammar theory, helping you understand their relative 
        capabilities, applications, and limitations.
      </IntroText>
      
      <VisualComparison {...cfgVsRegularComparison} />
      <VisualComparison {...derivationComparison} />
      <VisualComparison {...normalFormsComparison} />
      <VisualComparison {...parsingAlgorithmsComparison} />
      <VisualComparison {...cfgExamplesComparison} />
    </ComparisonsContainer>
  );
}

export default VisualComparisons;