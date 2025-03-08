import React from 'react';
import styled from 'styled-components';

// Styled components for DFA transitions
export const TransitionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  margin-top: var(--spacing-sm);
  
  th, td {
    border: 1px solid var(--border-color);
    padding: var(--spacing-md);
    text-align: left;
  }
  
  th {
    background-color: var(--background-light);
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: var(--background-lighter);
  }
`;

export const TransitionSelect = styled.select`
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  }
`;

/**
 * DFATransitions component
 * 
 * A specialized component for rendering and managing DFA transitions.
 * 
 * @param {Object} props Component props
 * @param {Object} props.automaton The DFA model
 * @param {Function} props.onTransitionChange Handler for transition changes
 */
const DFATransitions = ({ automaton, onTransitionChange }) => {
  // Handle selects without values in transition table
  const getTransitionValue = (state, symbol) => {
    return automaton.transitions[state]?.[symbol] || '';
  };

  return (
    <TransitionTable>
      <thead>
        <tr>
          <th>State</th>
          {automaton.alphabet.map(symbol => (
            <th key={symbol}>{symbol}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {automaton.states.map(state => (
          <tr key={state}>
            <td>{state}</td>
            {automaton.alphabet.map(symbol => (
              <td key={`${state}-${symbol}`}>
                <TransitionSelect 
                  value={getTransitionValue(state, symbol)} 
                  onChange={(e) => onTransitionChange(state, symbol, e.target.value)}
                  variant="dfa"
                >
                  <option value="">Select state</option>
                  {automaton.states.map(toState => (
                    <option key={toState} value={toState}>
                      {toState}
                    </option>
                  ))}
                </TransitionSelect>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </TransitionTable>
  );
};

export default DFATransitions;