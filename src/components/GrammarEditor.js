import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  background: var(--surface-color);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 30px var(--shadow-color);
  border: 2px solid var(--border-color);
`;

const Title = styled.h2`
  margin-top: 0;
  color: var(--text-color);
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
`;

const HistoryControls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--spacing-md);
`;

const HistoryButton = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.disabled ? '#f0f0f0' : 'var(--surface-color)'};
  color: ${props => props.disabled ? '#888' : 'var(--text-color)'};
  border: 2px solid ${props => props.disabled ? '#e0e0e0' : 'var(--border-color)'};
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-left: var(--spacing-sm);
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.disabled ? '#f0f0f0' : 'var(--background-color)'};
    transform: translateY(-2px);
  }
  
  transition: all 0.2s ease;
  
  svg {
    margin-right: 8px;
  }
`;

const SymbolSection = styled.div`
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  background-color: var(--background-color);
`;

const SymbolLabel = styled.label`
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: bold;
  font-size: var(--font-size-lg);
  color: var(--text-color);
`;

const GrammarNote = styled.div`
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background-color: rgba(255, 152, 0, 0.1);
  border-left: 6px solid var(--highlight-color);
  font-size: var(--font-size-base);
  line-height: 1.7;
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
`;

const SymbolInput = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
`;

const ProductionList = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const ProductionItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ProductionFrom = styled.input`
  width: 80px;
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  margin-right: var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: 600;
`;

const Arrow = styled.span`
  margin: 0 var(--spacing-md);
  font-size: var(--font-size-xl);
  font-weight: bold;
`;

const ProductionTo = styled.input`
  flex: 1;
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  margin-right: var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  
  &:hover {
    background-color: #0062c9;
    transform: translateY(-2px);
  }
  
  transition: all 0.2s ease;
`;

const RemoveButton = styled.button`
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: 12px 20px;
  margin-left: var(--spacing-md);
  cursor: pointer;
  font-size: var(--font-size-base);
  font-weight: 600;
  
  &:hover {
    background-color: #d32f2f;
    transform: translateY(-2px);
  }
  
  transition: all 0.2s ease;
`;

const StartSymbolSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Select = styled.select`
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  width: 100%;
  font-size: var(--font-size-lg);
  font-weight: 500;
  background-color: var(--surface-color);
  
  option {
    padding: var(--spacing-sm);
  }
`;

function GrammarEditor({ grammar, setGrammar }) {
  const [nonTerminalInput, setNonTerminalInput] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [newProduction, setNewProduction] = useState({ from: '', to: '' });
  
  // Add history functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Track grammar changes in history
  useEffect(() => {
    if (grammar && (!history.length || JSON.stringify(grammar) !== JSON.stringify(history[historyIndex]))) {
      // Remove any future history if we're not at the end
      const newHistory = history.slice(0, historyIndex + 1);
      
      // Add current grammar to history
      newHistory.push(JSON.parse(JSON.stringify(grammar)));
      
      // Limit history size (optional)
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [grammar, history, historyIndex]);
  
  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGrammar(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };
  
  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setGrammar(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const handleAddNonTerminal = () => {
    if (nonTerminalInput && !grammar.nonTerminals.includes(nonTerminalInput)) {
      setGrammar({
        ...grammar,
        nonTerminals: [...grammar.nonTerminals, nonTerminalInput]
      });
      setNonTerminalInput('');
    }
  };

  const handleAddTerminal = () => {
    if (terminalInput && !grammar.terminals.includes(terminalInput)) {
      setGrammar({
        ...grammar,
        terminals: [...grammar.terminals, terminalInput]
      });
      setTerminalInput('');
    }
  };

  const handleAddProduction = () => {
    if (newProduction.from && newProduction.to) {
      setGrammar({
        ...grammar,
        productions: [...grammar.productions, { ...newProduction }]
      });
      setNewProduction({ from: '', to: '' });
    }
  };

  const handleRemoveProduction = (index) => {
    const updatedProductions = [...grammar.productions];
    updatedProductions.splice(index, 1);
    setGrammar({
      ...grammar,
      productions: updatedProductions
    });
  };

  const handleStartSymbolChange = (e) => {
    setGrammar({
      ...grammar,
      startSymbol: e.target.value
    });
  };

  return (
    <EditorContainer>
      <Title>Grammar Editor</Title>
      
      <HistoryControls>
        <HistoryButton onClick={handleUndo} disabled={historyIndex <= 0}>
          ↩ Undo
        </HistoryButton>
        <HistoryButton onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
          Redo ↪
        </HistoryButton>
      </HistoryControls>
      
      <GrammarNote>
        A context-free grammar consists of non-terminals (variables), terminals (actual symbols in strings),
        productions (rules), and a start symbol. Edit your grammar below to experiment with different language patterns.
      </GrammarNote>
      
      <SymbolSection>
        <SymbolLabel>Non-terminals:</SymbolLabel>
        <GrammarNote>
          Non-terminals are variables that can be replaced by other symbols. By convention, they are often uppercase letters (A, B, S).
        </GrammarNote>
        <div style={{ display: 'flex' }}>
          <SymbolInput
            type="text"
            value={nonTerminalInput}
            onChange={(e) => setNonTerminalInput(e.target.value)}
            placeholder="Enter non-terminal"
          />
          <Button onClick={handleAddNonTerminal}>Add</Button>
        </div>
        <div>
          Current: {grammar.nonTerminals.join(', ')}
        </div>
      </SymbolSection>
      
      <SymbolSection>
        <SymbolLabel>Terminals:</SymbolLabel>
        <GrammarNote>
          Terminals are the actual symbols that appear in the language strings. These cannot be replaced further.
        </GrammarNote>
        <div style={{ display: 'flex' }}>
          <SymbolInput
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Enter terminal"
          />
          <Button onClick={handleAddTerminal}>Add</Button>
        </div>
        <div>
          Current: {grammar.terminals.join(', ')}
        </div>
      </SymbolSection>
      
      <StartSymbolSection>
        <SymbolLabel>Start Symbol:</SymbolLabel>
        <GrammarNote>
          The start symbol is the non-terminal from which all derivations begin. Every valid string in the language
          must be derivable from this symbol.
        </GrammarNote>
        <Select value={grammar.startSymbol} onChange={handleStartSymbolChange}>
          {grammar.nonTerminals.map((nt) => (
            <option key={nt} value={nt}>
              {nt}
            </option>
          ))}
        </Select>
      </StartSymbolSection>
      
      <ProductionList>
        <SymbolLabel>Productions:</SymbolLabel>
        <GrammarNote>
          Productions are rules that define how non-terminals can be replaced. Each rule has a left side (a non-terminal)
          and a right side (a string of terminals and non-terminals). For example, S → AB means the non-terminal S can be
          replaced with the string AB.
        </GrammarNote>
        
        {grammar.productions.map((production, index) => (
          <ProductionItem key={index}>
            <ProductionFrom
              value={production.from}
              disabled
            />
            <Arrow>→</Arrow>
            <ProductionTo
              value={production.to}
              disabled
            />
            <RemoveButton onClick={() => handleRemoveProduction(index)}>
              Remove
            </RemoveButton>
          </ProductionItem>
        ))}
        
        <GrammarNote>
          Add a new production rule below. The "From" field must be a non-terminal, and the "To" field can be any
          combination of terminals and non-terminals. For epsilon (empty string) rules, use 'ε' in the "To" field.
        </GrammarNote>
        
        <ProductionItem>
          <ProductionFrom
            value={newProduction.from}
            onChange={(e) => setNewProduction({ ...newProduction, from: e.target.value })}
            placeholder="From"
          />
          <Arrow>→</Arrow>
          <ProductionTo
            value={newProduction.to}
            onChange={(e) => setNewProduction({ ...newProduction, to: e.target.value })}
            placeholder="To"
          />
          <Button onClick={handleAddProduction}>Add</Button>
        </ProductionItem>
        
        <GrammarNote>
          Example productions:
          <ul>
            <li>S → AB (replace S with AB)</li>
            <li>A → aA (replace A with aA)</li>
            <li>A → a (replace A with a)</li>
            <li>S → ε (replace S with the empty string)</li>
          </ul>
        </GrammarNote>
      </ProductionList>
    </EditorContainer>
  );
}

export default GrammarEditor;