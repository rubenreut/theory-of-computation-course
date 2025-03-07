import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { parseCYK } from '../utils/cykParser';

const ParserContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #333;
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
`;

const InputString = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const ParseButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
`;

const StepByStepContainer = styled.div`
  margin-top: 20px;
  overflow-x: auto; /* Allow horizontal scrolling if table is too wide */
  max-width: 100%; /* Ensure container doesn't overflow parent */
`;

const Status = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  color: ${props => props.accepted ? '#4CAF50' : '#f44336'};
  font-weight: bold;
`;

const CYKTable = styled.table`
  min-width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed; /* Fixed layout for better control */
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: center;
  min-width: 60px; /* Ensure cells have enough space */
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px 12px;
  background-color: #f2f2f2;
  text-align: center;
  min-width: 60px; /* Ensure header cells have enough space */
`;

const ParsingNote = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: #e8f5e9;
  border-left: 4px solid #4CAF50;
  font-size: 14px;
  line-height: 1.5;
`;

function Parser({ grammar, inputString, setInputString }) {
  const [parseResult, setParseResult] = useState(null);
  const [parseTable, setParseTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputString(e.target.value);
  };

  const handleParse = () => {
    setIsLoading(true);
    
    // Small delay to allow UI to update
    setTimeout(() => {
      try {
        const result = parseCYK(grammar, inputString);
        setParseResult(result.accepted);
        setParseTable(result.table);
      } catch (error) {
        console.error("Parsing error:", error);
        setParseResult(false);
        setParseTable([]);
      }
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    // Reset results when grammar or input changes
    setParseResult(null);
    setParseTable([]);
  }, [grammar, inputString]);

  return (
    <ParserContainer>
      <Title>Parse Input String</Title>
      
      <ParsingNote>
        This parser implements the CYK (Cocke-Younger-Kasami) algorithm to determine if a string can be derived from the grammar.
        For best results, ensure your grammar is close to Chomsky Normal Form (productions of form A → BC or A → a).
      </ParsingNote>
      
      <InputContainer>
        <InputString
          type="text"
          value={inputString}
          onChange={handleInputChange}
          placeholder="Enter string to parse"
        />
        <ParseButton onClick={handleParse} disabled={isLoading}>
          {isLoading ? 'Parsing...' : 'Parse'}
        </ParseButton>
      </InputContainer>
      
      {parseResult !== null && (
        <ResultContainer>
          <Status accepted={parseResult}>
            {parseResult ? 'String Accepted! ✓' : 'String Rejected! ✗'}
          </Status>
          
          {parseTable.length > 0 && (
            <StepByStepContainer>
              <h3>CYK Parsing Table:</h3>
              <ParsingNote>
                The CYK table shows which non-terminals can derive each substring of the input. Each cell [i,j] contains
                non-terminals that can derive the substring from position i to position j. The string is accepted if the
                start symbol appears in cell [0,n-1] (where n is the string length).
              </ParsingNote>
              <CYKTable>
                <thead>
                  <tr>
                    <TableHeader>j →<br/>i ↓</TableHeader>
                    {inputString.split('').map((char, index) => (
                      <TableHeader key={index}>{index} ({char})</TableHeader>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parseTable.map((row, i) => (
                    <tr key={i}>
                      <TableHeader>{i}</TableHeader>
                      {row.map((cell, j) => (
                        <TableCell key={j}>
                          {Array.isArray(cell) && cell.length > 0 
                            ? cell.join(', ') 
                            : cell 
                              ? cell 
                              : '-'}
                        </TableCell>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </CYKTable>
              <ParsingNote>
                How to read this table: The bottom-right cell represents the entire input string. Cells along the 
                diagonal represent single characters. The string is accepted if the start symbol ({grammar.startSymbol}) 
                appears in the cell [0,{inputString.length-1}].
              </ParsingNote>
            </StepByStepContainer>
          )}
        </ResultContainer>
      )}
    </ParserContainer>
  );
}

export default Parser;