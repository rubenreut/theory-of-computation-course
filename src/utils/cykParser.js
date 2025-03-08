/**
 * Implements the CYK (Cocke-Younger-Kasami) parsing algorithm
 * for context-free grammars in Chomsky Normal Form
 */

/**
 * Parses a string using the CYK algorithm
 * @param {Object} grammar - The grammar to use for parsing
 * @param {string} inputString - The string to parse
 * @returns {Object} - Result object with acceptance status and parse table
 */
export const parseCYK = (grammar, inputString) => {
  if (!inputString) {
    return { accepted: false, table: [] };
  }
  
  const n = inputString.length;
  
  // Initialize the CYK table
  const table = Array(n).fill().map(() => Array(n).fill().map(() => []));
  
  // Fill in the diagonal (base case)
  for (let i = 0; i < n; i++) {
    const currentChar = inputString[i];
    
    // Find all non-terminals that can derive this terminal
    for (const production of grammar.productions) {
      if (production.to === currentChar) {
        table[i][i].push(production.from);
      }
    }
  }
  
  // Fill in the rest of the table
  for (let l = 2; l <= n; l++) {  // Length of substring
    for (let i = 0; i <= n - l; i++) {  // Starting position
      const j = i + l - 1;  // Ending position
      
      // Try all possible splitting points
      for (let k = i; k < j; k++) {
        // Check if we can form a production from two non-terminals
        for (const production of grammar.productions) {
          // Skip terminal productions (already handled in base case)
          if (production.to.length !== 2) continue;
          
          const [B, C] = production.to.split('');
          
          // If B is in table[i][k] and C is in table[k+1][j], then add A to table[i][j]
          if (table[i][k].includes(B) && table[k+1][j].includes(C)) {
            if (!table[i][j].includes(production.from)) {
              table[i][j].push(production.from);
            }
          }
        }
      }
    }
  }
  
  // The string is accepted if the start symbol is in the top-right cell
  const accepted = table[0][n-1].includes(grammar.startSymbol);
  
  return { accepted, table };
};

/**
 * Checks if a grammar is in Chomsky Normal Form
 * @param {Object} grammar - The grammar to check
 * @returns {boolean} - True if the grammar is in CNF
 */
export const isChomskyNormalForm = (grammar) => {
  for (const production of grammar.productions) {
    const { from, to } = production;
    
    // Check if production is from a non-terminal
    if (!grammar.nonTerminals.includes(from)) {
      return false;
    }
    
    // Rule should be either A -> BC or A -> a
    if (to.length === 1) {
      // Terminal rule: should be a terminal
      if (!grammar.terminals.includes(to)) {
        return false;
      }
    } else if (to.length === 2) {
      // Non-terminal rule: both symbols should be non-terminals
      if (!grammar.nonTerminals.includes(to[0]) || !grammar.nonTerminals.includes(to[1])) {
        return false;
      }
    } else {
      // Not CNF, rule is neither A -> BC nor A -> a
      return false;
    }
  }
  
  return true;
};

/**
 * Converts a grammar to Chomsky Normal Form (simplified version)
 * This is a simplified conversion that handles only basic cases
 * @param {Object} grammar - The grammar to convert
 * @returns {Object} - The grammar in CNF
 */
export const convertToCNF = (grammar) => {
  // Deep copy the grammar to avoid modifying the original
  const cnfGrammar = JSON.parse(JSON.stringify(grammar));
  let newProductions = [];
  
  // Step 1: Eliminate ε productions 
  // For now, we just exclude them and handle them separately
  const nonEpsilonProductions = cnfGrammar.productions.filter(p => p.to !== 'ε');
  
  // Step 2: Replace each production A -> X1 X2 ... Xn (n > 2) with A -> X1 Y1, Y1 -> X2 Y2, ..., Yn-2 -> Xn-1 Xn
  let newNTIndex = 1;
  
  for (const production of nonEpsilonProductions) {
    const { from, to } = production;
    
    if (to.length > 2) {
      let lastNT = from;
      for (let i = 0; i < to.length - 2; i++) {
        const newNT = `Y${newNTIndex++}`;
        
        // Add the new non-terminal to the grammar
        if (!cnfGrammar.nonTerminals.includes(newNT)) {
          cnfGrammar.nonTerminals.push(newNT);
        }
        
        // Add new production
        if (i === 0) {
          newProductions.push({ from: lastNT, to: to[i] + newNT });
        } else {
          newProductions.push({ from: lastNT, to: to[i] + newNT });
        }
        
        lastNT = newNT;
      }
      
      // Add the last production
      newProductions.push({ from: lastNT, to: to[to.length - 2] + to[to.length - 1] });
    } else {
      newProductions.push(production);
    }
  }
  
  // Step 3: Replace productions with mixed terminals and non-terminals
  const tempProductions = [...newProductions];
  newProductions = [];
  
  for (const production of tempProductions) {
    const { from, to } = production;
    
    if (to.length === 2) {
      const [first, second] = to.split('');
      let newTo = '';
      
      // Replace terminals with new non-terminals
      if (grammar.terminals.includes(first)) {
        const newNT = `T_${first}`;
        
        // Add the new non-terminal if it doesn't exist
        if (!cnfGrammar.nonTerminals.includes(newNT)) {
          cnfGrammar.nonTerminals.push(newNT);
          // Add production T_a -> a
          newProductions.push({ from: newNT, to: first });
        }
        
        newTo += newNT;
      } else {
        newTo += first;
      }
      
      if (grammar.terminals.includes(second)) {
        const newNT = `T_${second}`;
        
        // Add the new non-terminal if it doesn't exist
        if (!cnfGrammar.nonTerminals.includes(newNT)) {
          cnfGrammar.nonTerminals.push(newNT);
          // Add production T_a -> a
          newProductions.push({ from: newNT, to: second });
        }
        
        newTo += newNT;
      } else {
        newTo += second;
      }
      
      newProductions.push({ from, to: newTo });
    } else {
      newProductions.push(production);
    }
  }
  
  cnfGrammar.productions = newProductions;
  
  return cnfGrammar;
};