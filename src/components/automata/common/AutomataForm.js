import React from 'react';
import styled from 'styled-components';

// Form styled components
export const Panel = styled.div`
  width: 100%;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-xl);
  border: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

export const PanelHeader = styled.div`
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PanelTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

export const Label = styled.label`
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
`;

export const Input = styled.input`
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  }
`;

export const TestInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
`;

export const InputContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

export const TestInput = styled.input`
  flex: 1;
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  
  &:focus {
    outline: none;
    border-color: ${props => 
      props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  }
`;

export const Button = styled.button`
  background-color: ${props => 
    props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => 
      props.variant === 'nfa' ? 'var(--tertiary-color-dark)' : 'var(--secondary-color-dark)'};
  }
  
  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }
`;

export const TestResult = styled.div`
  display: ${props => props.visible ? 'block' : 'none'};
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: ${props => 
    props.accepted ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)'};
  color: ${props => 
    props.accepted ? 'var(--success-color)' : 'var(--error-color)'};
  font-weight: 500;
`;

/**
 * AutomataForm component
 * 
 * A reusable form component for defining automata (DFA/NFA).
 * 
 * @param {Object} props Component props
 * @param {string} props.variant The variant of the automaton ('dfa' or 'nfa')
 * @param {Object} props.automaton The automaton model
 * @param {Function} props.onStatesChange Handler for states change
 * @param {Function} props.onAlphabetChange Handler for alphabet change
 * @param {Function} props.onInitialStateChange Handler for initial state change
 * @param {Function} props.onAcceptingStatesChange Handler for accepting states change
 * @param {string} props.testInput Test input string
 * @param {Function} props.onTestInputChange Handler for test input change
 * @param {Function} props.onTestSubmit Handler for test submit
 * @param {Object} props.testResult Test result object {visible, accepted, message}
 * @param {React.ReactNode} props.transitionsComponent Component for rendering transitions
 * @param {React.ReactNode} props.additionalControls Additional form controls to render
 */
const AutomataForm = ({
  variant = 'dfa',
  automaton,
  onStatesChange,
  onAlphabetChange,
  onInitialStateChange,
  onAcceptingStatesChange,
  testInput,
  onTestInputChange,
  onTestSubmit,
  testResult,
  transitionsComponent,
  additionalControls
}) => {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>Define {variant.toUpperCase()}</PanelTitle>
      </PanelHeader>
      
      <Form>
        <FormGroup>
          <Label htmlFor="states">States (comma separated):</Label>
          <Input 
            type="text" 
            id="states" 
            value={automaton.states.join(', ')} 
            onChange={onStatesChange} 
            placeholder="e.g., q0, q1, q2"
            variant={variant}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="alphabet">Alphabet (comma separated):</Label>
          <Input 
            type="text" 
            id="alphabet" 
            value={automaton.alphabet.join(', ')} 
            onChange={onAlphabetChange} 
            placeholder="e.g., 0, 1"
            variant={variant}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="initialState">Initial State:</Label>
          <Input 
            type="text" 
            id="initialState" 
            value={automaton.initialState} 
            onChange={onInitialStateChange} 
            list="states-list"
            placeholder="Starting state"
            variant={variant}
          />
          <datalist id="states-list">
            {automaton.states.map(state => (
              <option key={state} value={state} />
            ))}
          </datalist>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="acceptingStates">Accepting States (comma separated):</Label>
          <Input 
            type="text" 
            id="acceptingStates" 
            value={automaton.acceptingStates.join(', ')} 
            onChange={onAcceptingStatesChange} 
            placeholder="e.g., q2"
            variant={variant}
          />
        </FormGroup>
        
        {additionalControls}
        
        <FormGroup>
          <Label>Transition Function:</Label>
          {transitionsComponent}
        </FormGroup>
        
        <TestInputContainer>
          <Label htmlFor="testInput">Test Input String:</Label>
          <InputContainer>
            <TestInput 
              type="text" 
              id="testInput" 
              value={testInput} 
              onChange={onTestInputChange} 
              placeholder={`e.g., ${automaton.alphabet.join('')}${automaton.alphabet[0] || ''}`}
              variant={variant}
            />
            <Button 
              onClick={onTestSubmit}
              variant={variant}
            >
              Test {variant.toUpperCase()}
            </Button>
          </InputContainer>
          
          <TestResult 
            visible={testResult.visible}
            accepted={testResult.accepted}
          >
            {testResult.message}
          </TestResult>
        </TestInputContainer>
      </Form>
    </Panel>
  );
};

export default AutomataForm;