import React, { createContext, useState, useContext } from 'react';

const CFGContext = createContext();

export const useCFG = () => useContext(CFGContext);

export const CFGProvider = ({ children }) => {
  // Initial grammar setup with a simple example
  const [grammar, setGrammar] = useState({
    nonTerminals: ['S', 'A', 'B'],
    terminals: ['a', 'b'],
    productions: [
      { from: 'S', to: 'AB' },
      { from: 'A', to: 'aA' },
      { from: 'A', to: 'a' },
      { from: 'B', to: 'bB' },
      { from: 'B', to: 'b' }
    ],
    startSymbol: 'S'
  });
  
  const [inputString, setInputString] = useState('aabb');

  const value = {
    grammar,
    setGrammar,
    inputString,
    setInputString
  };

  return <CFGContext.Provider value={value}>{children}</CFGContext.Provider>;
};

export default CFGProvider;