// Short definitions for tooltips throughout the application
// These are intentionally brief to fit in tooltips, with full definitions available in the glossary

const tooltipDefinitions = {
  "terminal": "A basic symbol that cannot be replaced by grammar rules. Terminals form the actual strings in the language.",
  
  "non-terminal": "A variable symbol that can be replaced by other symbols according to the grammar's production rules.",
  
  "production rule": "A rewriting rule that specifies how symbols in the grammar can be replaced or transformed.",
  
  "derivation": "A sequence of production rule applications that transforms the start symbol into a string of terminals.",
  
  "start symbol": "The distinguished non-terminal symbol from which all derivations begin.",
  
  "context-free grammar": "A formal grammar where every production rule has a single non-terminal on its left-hand side.",
  
  "parse tree": "A graphical representation of a derivation, showing the hierarchical structure of a string according to a grammar.",
  
  "leftmost derivation": "A derivation where, at each step, the leftmost non-terminal in the sentential form is replaced.",
  
  "rightmost derivation": "A derivation where, at each step, the rightmost non-terminal in the sentential form is replaced.",
  
  "Chomsky Normal Form": "A standardized form for CFGs where all productions are of the form A → BC or A → a.",
  
  "Greibach Normal Form": "A standardized form for CFGs where all productions are of the form A → aα (terminal followed by non-terminals).",
  
  "ambiguity": "A property of a grammar where at least one string has more than one distinct parse tree or derivation.",
  
  "sentential form": "Any string of terminals and non-terminals that can be derived from the start symbol.",
  
  "language": "The set of all terminal strings that can be derived from the start symbol of a grammar.",
  
  "CYK algorithm": "A dynamic programming algorithm for determining whether a string can be derived from a context-free grammar.",
  
  "LL parsing": "A top-down parsing method that builds a leftmost derivation by scanning the input from left to right.",
  
  "LR parsing": "A bottom-up parsing method that builds a rightmost derivation in reverse by scanning the input from left to right.",
  
  "recursive descent parsing": "A top-down parsing technique where each non-terminal in the grammar is implemented as a recursive function.",
  
  "shift-reduce parsing": "A bottom-up parsing technique where the parser shifts input symbols onto a stack and reduces them when a rule is recognized.",
  
  "First set": "For a grammar symbol X, FIRST(X) is the set of terminals that can appear as the first symbol of any string derived from X.",
  
  "Follow set": "For a non-terminal A, FOLLOW(A) is the set of terminals that can appear immediately after A in any sentential form.",
  
  "left recursion": "A situation where a non-terminal appears as the leftmost symbol in the right-hand side of its own production.",
  
  "pushdown automaton": "A computational model that extends a finite automaton with a stack, capable of recognizing context-free languages.",
  
  "pumping lemma": "A property that all context-free languages must satisfy, used to prove certain languages are not context-free.",
  
  "ε-production": "A production rule that has the empty string (ε) as its right-hand side.",
  
  "unit production": "A production rule where the right-hand side consists of a single non-terminal symbol."
};

export default tooltipDefinitions;