import React from 'react';
import styled from 'styled-components';

// Styled components for NFA transitions
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

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-right: var(--spacing-md);
  font-weight: 500;
  user-select: none;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${props => 
      props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

/**
 * NFATransitions component
 * 
 * A specialized component for rendering and managing NFA transitions.
 * 
 * @param {Object} props Component props
 * @param {Object} props.automaton The NFA model
 * @param {Function} props.onTransitionChange Handler for transition changes
 * @param {boolean} props.showEpsilonTransitions Whether to show epsilon transitions
 */
const NFATransitions = ({ 
  automaton, 
  onTransitionChange, 
  showEpsilonTransitions 
}) => {
  // Check if a transition exists
  const hasTransition = (fromState, symbol, toState) => {
    return automaton.transitions[fromState]?.[symbol]?.includes(toState) || false;
  };

  // Get symbols to display (including epsilon if enabled)
  const getSymbols = () => {
    return showEpsilonTransitions 
      ? [...automaton.alphabet, 'ε'] 
      : automaton.alphabet;
  };

  return (
    <TransitionTable>
      <thead>
        <tr>
          <th>From</th>
          <th>Symbol</th>
          <th>To States</th>
        </tr>
      </thead>
      <tbody>
        {automaton.states.map(fromState => 
          getSymbols().map(symbol => (
            <tr key={`${fromState}-${symbol}`}>
              <td>{fromState}</td>
              <td>{symbol}</td>
              <td>
                <CheckboxContainer>
                  {automaton.states.map(toState => (
                    <CheckboxLabel key={`${fromState}-${symbol}-${toState}`} variant="nfa">
                      <input 
                        type="checkbox"
                        checked={hasTransition(fromState, symbol, toState)}
                        onChange={(e) => onTransitionChange(
                          fromState, 
                          symbol, 
                          toState, 
                          { action: e.target.checked ? 'add' : 'remove' }
                        )}
                      />
                      {toState}
                    </CheckboxLabel>
                  ))}
                </CheckboxContainer>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TransitionTable>
  );
};

export default NFATransitions;