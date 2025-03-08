/**
 * Utility functions for working with context-free grammars
 */

/**
 * Generates a random derivation tree for a given grammar and start symbol
 * @param {Object} grammar - The grammar to use
 * @param {string} symbol - The current symbol to derive (start with the start symbol)
 * @param {number} maxDepth - Maximum depth of the tree to prevent infinite recursion
 * @returns {Object} - Tree node object that can be rendered
 */
export const getRandomDerivation = (grammar, symbol, maxDepth = 4) => {
  // Base case: reached max depth or symbol is a terminal
  if (maxDepth <= 0 || grammar.terminals.includes(symbol)) {
    return { symbol, children: [] };
  }
  
  // Find all productions for this non-terminal
  const applicableProductions = grammar.productions.filter(p => p.from === symbol);
  
  // If no productions exist, return as a leaf node
  if (applicableProductions.length === 0) {
    return { symbol, children: [] };
  }
  
  // Choose a random production
  const randomProduction = applicableProductions[Math.floor(Math.random() * applicableProductions.length)];
  
  // Create children nodes
  const children = [];
  for (const char of randomProduction.to) {
    // Recursively derive each symbol with reduced max depth
    children.push(getRandomDerivation(grammar, char, maxDepth - 1));
  }
  
  return { symbol, children };
};

/**
 * Validates a grammar structure
 * @param {Object} grammar - The grammar to validate
 * @returns {Object} - Validation result with isValid flag and error message
 */
export const validateGrammar = (grammar) => {
  // Check for required properties
  if (!grammar.nonTerminals || !Array.isArray(grammar.nonTerminals)) {
    return { isValid: false, error: 'Non-terminals must be an array' };
  }
  
  if (!grammar.terminals || !Array.isArray(grammar.terminals)) {
    return { isValid: false, error: 'Terminals must be an array' };
  }
  
  if (!grammar.productions || !Array.isArray(grammar.productions)) {
    return { isValid: false, error: 'Productions must be an array' };
  }
  
  if (!grammar.startSymbol) {
    return { isValid: false, error: 'Start symbol is required' };
  }
  
  // Check if start symbol is a non-terminal
  if (!grammar.nonTerminals.includes(grammar.startSymbol)) {
    return { isValid: false, error: 'Start symbol must be a non-terminal' };
  }
  
  // Validate productions
  for (const production of grammar.productions) {
    if (!production.from || !production.to) {
      return { isValid: false, error: 'Each production must have "from" and "to" properties' };
    }
    
    // Check if "from" is a non-terminal
    if (!grammar.nonTerminals.includes(production.from)) {
      return { isValid: false, error: `Production "from" must be a non-terminal: ${production.from}` };
    }
    
    // Check if "to" only contains valid symbols
    for (const symbol of production.to) {
      if (!grammar.nonTerminals.includes(symbol) && !grammar.terminals.includes(symbol) && symbol !== 'ε') {
        return { isValid: false, error: `Unknown symbol in production: ${symbol}` };
      }
    }
  }
  
  return { isValid: true };
};

/**
 * Computes the First set for each non-terminal in a grammar
 * The First set of a symbol X is the set of terminals that can appear 
 * as the first symbol of some string derived from X
 * @param {Object} grammar - The grammar to analyze
 * @returns {Object} - Map of non-terminals to their First sets
 */
export const computeFirstSets = (grammar) => {
  const first = {};
  
  // Initialize First sets
  for (const nonTerminal of grammar.nonTerminals) {
    first[nonTerminal] = new Set();
  }
  
  let changed = true;
  while (changed) {
    changed = false;
    
    for (const production of grammar.productions) {
      const { from, to } = production;
      
      if (to === 'ε') {
        // If X → ε is a production, add ε to First(X)
        if (!first[from].has('ε')) {
          first[from].add('ε');
          changed = true;
        }
      } else if (to.length > 0) {
        const firstSymbol = to[0];
        
        if (grammar.terminals.includes(firstSymbol)) {
          // If X → aα is a production, add a to First(X)
          if (!first[from].has(firstSymbol)) {
            first[from].add(firstSymbol);
            changed = true;
          }
        } else if (grammar.nonTerminals.includes(firstSymbol)) {
          // If X → Yα is a production, add First(Y) - {ε} to First(X)
          for (const terminal of first[firstSymbol]) {
            if (terminal !== 'ε' && !first[from].has(terminal)) {
              first[from].add(terminal);
              changed = true;
            }
          }
          
          // If ε is in First(Y), need to consider what follows Y
          if (first[firstSymbol].has('ε')) {
            if (to.length > 1) {
              // Case with multiple symbols: if Y→ε, add First(rest) to First(X)
              const restOfProduction = to.slice(1);
              const nextSymbol = restOfProduction[0];
              
              if (grammar.terminals.includes(nextSymbol)) {
                // If the next symbol is a terminal, add it to First(X)
                if (!first[from].has(nextSymbol)) {
                  first[from].add(nextSymbol);
                  changed = true;
                }
              } else if (grammar.nonTerminals.includes(nextSymbol)) {
                // If the next symbol is a non-terminal, add its First set
                for (const terminal of first[nextSymbol]) {
                  if (terminal !== 'ε' && !first[from].has(terminal)) {
                    first[from].add(terminal);
                    changed = true;
                  }
                }
                
                // If all symbols can derive ε, add ε to First(X)
                if (first[nextSymbol].has('ε') && restOfProduction.length === 1) {
                  if (!first[from].has('ε')) {
                    first[from].add('ε');
                    changed = true;
                  }
                }
              }
            } else {
              // If Y is the only symbol and Y→ε, add ε to First(X)
              if (!first[from].has('ε')) {
                first[from].add('ε');
                changed = true;
              }
            }
          }
        }
      }
    }
  }
  
  // Convert Sets to Arrays for easier use in components
  const result = {};
  for (const nt in first) {
    result[nt] = Array.from(first[nt]);
  }
  
  return result;
};