import React, { useState } from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-top: 0;
  color: #333;
`;

const SymbolSection = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fafafa;
`;

const SymbolLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const GrammarNote = styled.div`
  margin: 10px 0;
  padding: 10px;
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
  font-size: 14px;
  line-height: 1.5;
`;

const SymbolInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ProductionList = styled.div`
  margin-bottom: 20px;
`;

const ProductionItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProductionFrom = styled.input`
  width: 50px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const Arrow = styled.span`
  margin: 0 10px;
`;

const ProductionTo = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const RemoveButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const StartSymbolSection = styled.div`
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

function GrammarEditor({ grammar, setGrammar }) {
  const [nonTerminalInput, setNonTerminalInput] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [newProduction, setNewProduction] = useState({ from: '', to: '' });

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