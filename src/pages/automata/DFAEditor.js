import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import WordCount from '../../components/WordCount';

const EditorContainer = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--text-color);
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 700px;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  font-size: var(--font-size-lg);
  
  & input, & textarea, & select, & button {
    font-size: var(--font-size-lg);
    padding: 12px 16px;
  }
`;

const PanelTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: var(--secondary-color);
    border-radius: 50%;
    margin-right: 12px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const Label = styled.label`
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-sm);
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.2);
  }
`;

const TransitionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--spacing-lg);
  
  th, td {
    border: 1px solid var(--border-color);
    padding: 10px;
    text-align: center;
  }
  
  th {
    background-color: rgba(0, 0, 0, 0.03);
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

const Button = styled.button`
  background-color: var(--secondary-color);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
  margin-right: var(--spacing-sm);
  
  &:hover {
    background-color: #2db04e;
  }
  
  &:disabled {
    background-color: var(--border-color);
    cursor: not-allowed;
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 400px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  background-color: white;
`;

const TestInputContainer = styled.div`
  margin-top: var(--spacing-xl);
`;

const InputContainer = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
`;

const TestInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.2);
  }
`;

const TestResult = styled.div`
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  background-color: ${props => props.accepted ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)'};
  border: 1px solid ${props => props.accepted ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)'};
  color: ${props => props.accepted ? 'var(--secondary-color)' : 'var(--danger-color)'};
  font-weight: 500;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const DFAEditor = () => {
  // Initial DFA state
  const [dfa, setDFA] = useState({
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    transitions: {
      q0: { '0': 'q0', '1': 'q1' },
      q1: { '0': 'q2', '1': 'q0' },
      q2: { '0': 'q1', '1': 'q2' }
    },
    initialState: 'q0',
    acceptingStates: ['q2']
  });
  
  // Test input
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState({ visible: false, accepted: false });
  
  // Canvas ref for drawing the DFA
  const canvasRef = useRef(null);
  
  // Handle updating states
  const handleStatesChange = (e) => {
    const statesStr = e.target.value;
    const statesArray = statesStr.split(',').map(s => s.trim()).filter(s => s);
    
    // Update transitions to include new states and remove old ones
    const newTransitions = {};
    statesArray.forEach(state => {
      newTransitions[state] = dfa.transitions[state] || {};
      dfa.alphabet.forEach(symbol => {
        if (!newTransitions[state][symbol]) {
          newTransitions[state][symbol] = statesArray[0] || state;
        }
      });
    });
    
    // Make sure initial and accepting states are valid
    let newInitialState = dfa.initialState;
    if (!statesArray.includes(newInitialState)) {
      newInitialState = statesArray[0] || '';
    }
    
    let newAcceptingStates = dfa.acceptingStates.filter(state => statesArray.includes(state));
    if (newAcceptingStates.length === 0 && statesArray.length > 0) {
      newAcceptingStates = [statesArray[statesArray.length - 1]];
    }
    
    setDFA({
      ...dfa,
      states: statesArray,
      transitions: newTransitions,
      initialState: newInitialState,
      acceptingStates: newAcceptingStates
    });
  };
  
  // Handle updating alphabet
  const handleAlphabetChange = (e) => {
    const alphabetStr = e.target.value;
    const alphabetArray = alphabetStr.split(',').map(s => s.trim()).filter(s => s);
    
    // Update transitions to include new alphabet symbols
    const newTransitions = { ...dfa.transitions };
    dfa.states.forEach(state => {
      newTransitions[state] = newTransitions[state] || {};
      alphabetArray.forEach(symbol => {
        if (!newTransitions[state][symbol]) {
          newTransitions[state][symbol] = dfa.states[0] || state;
        }
      });
    });
    
    setDFA({
      ...dfa,
      alphabet: alphabetArray,
      transitions: newTransitions
    });
  };
  
  // Handle updating accepting states
  const handleAcceptingStatesChange = (e) => {
    const acceptingStatesStr = e.target.value;
    const acceptingStatesArray = acceptingStatesStr.split(',').map(s => s.trim())
      .filter(s => s && dfa.states.includes(s));
    
    setDFA({
      ...dfa,
      acceptingStates: acceptingStatesArray
    });
  };
  
  // Handle updating initial state
  const handleInitialStateChange = (e) => {
    const initialState = e.target.value;
    if (dfa.states.includes(initialState)) {
      setDFA({
        ...dfa,
        initialState
      });
    }
  };
  
  // Handle updating a transition
  const handleTransitionChange = (fromState, onSymbol, e) => {
    const toState = e.target.value;
    if (dfa.states.includes(toState)) {
      setDFA({
        ...dfa,
        transitions: {
          ...dfa.transitions,
          [fromState]: {
            ...dfa.transitions[fromState],
            [onSymbol]: toState
          }
        }
      });
    }
  };
  
  // Handle testing input string
  const handleTestInput = () => {
    let currentState = dfa.initialState;
    let accepted = false;
    
    // Process each character in the input
    for (let i = 0; i < testInput.length; i++) {
      const char = testInput[i];
      
      // Check if character is in alphabet
      if (!dfa.alphabet.includes(char)) {
        setTestResult({
          visible: true,
          accepted: false,
          message: `Invalid input: character '${char}' is not in the alphabet.`
        });
        return;
      }
      
      // Transition to next state
      currentState = dfa.transitions[currentState][char];
    }
    
    // Check if final state is accepting
    accepted = dfa.acceptingStates.includes(currentState);
    
    setTestResult({
      visible: true,
      accepted,
      message: accepted ? 'Input accepted!' : 'Input rejected.'
    });
  };
  
  // Draw the DFA on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up constants for drawing
    const stateRadius = 30;
    const numStates = dfa.states.length;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - stateRadius * 2;
    
    // Draw states
    dfa.states.forEach((state, index) => {
      const angle = (2 * Math.PI * index) / numStates;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Draw state circle
      ctx.beginPath();
      ctx.arc(x, y, stateRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = dfa.acceptingStates.includes(state) ? 'rgba(52, 199, 89, 0.2)' : 'white';
      ctx.fill();
      ctx.lineWidth = state === dfa.initialState ? 3 : 1;
      ctx.strokeStyle = state === dfa.initialState ? 'rgba(52, 199, 89, 1)' : '#333';
      ctx.stroke();
      
      // Draw state label
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state, x, y);
      
      // Draw accepting state inner circle if needed
      if (dfa.acceptingStates.includes(state)) {
        ctx.beginPath();
        ctx.arc(x, y, stateRadius - 5, 0, 2 * Math.PI, false);
        ctx.stroke();
      }
      
      // Draw arrow to initial state
      if (state === dfa.initialState) {
        const arrowLength = stateRadius * 1.5;
        const arrowX1 = x - arrowLength * Math.cos(angle);
        const arrowY1 = y - arrowLength * Math.sin(angle);
        const arrowX2 = x - stateRadius * Math.cos(angle);
        const arrowY2 = y - stateRadius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(arrowX1, arrowY1);
        ctx.lineTo(arrowX2, arrowY2);
        ctx.strokeStyle = 'rgba(52, 199, 89, 1)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw arrowhead
        const arrowSize = 10;
        const angle1 = Math.atan2(arrowY2 - arrowY1, arrowX2 - arrowX1);
        ctx.beginPath();
        ctx.moveTo(arrowX2, arrowY2);
        ctx.lineTo(
          arrowX2 - arrowSize * Math.cos(angle1 - Math.PI / 6),
          arrowY2 - arrowSize * Math.sin(angle1 - Math.PI / 6)
        );
        ctx.lineTo(
          arrowX2 - arrowSize * Math.cos(angle1 + Math.PI / 6),
          arrowY2 - arrowSize * Math.sin(angle1 + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = 'rgba(52, 199, 89, 1)';
        ctx.fill();
      }
    });
    
    // Draw transitions
    dfa.states.forEach((fromState, fromIndex) => {
      const fromAngle = (2 * Math.PI * fromIndex) / numStates;
      const fromX = centerX + radius * Math.cos(fromAngle);
      const fromY = centerY + radius * Math.sin(fromAngle);
      
      dfa.alphabet.forEach(symbol => {
        const toState = dfa.transitions[fromState][symbol];
        const toIndex = dfa.states.indexOf(toState);
        
        if (toIndex !== -1) {
          const toAngle = (2 * Math.PI * toIndex) / numStates;
          const toX = centerX + radius * Math.cos(toAngle);
          const toY = centerY + radius * Math.sin(toAngle);
          
          // Self-loop
          if (fromState === toState) {
            const loopRadius = stateRadius * 0.8;
            const loopX = fromX + stateRadius * 1.5 * Math.cos(fromAngle - Math.PI / 4);
            const loopY = fromY + stateRadius * 1.5 * Math.sin(fromAngle - Math.PI / 4);
            
            ctx.beginPath();
            ctx.arc(loopX, loopY, loopRadius, 0, 2 * Math.PI, false);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw symbol
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, loopX, loopY - loopRadius - 5);
          } 
          // Transition to another state
          else {
            // Calculate control point for curved line
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;
            const normalX = -(toY - fromY);
            const normalY = toX - fromX;
            const length = Math.sqrt(normalX * normalX + normalY * normalY);
            const curveFactor = 0.3;
            const cpX = midX + (normalX / length) * stateRadius * curveFactor * numStates;
            const cpY = midY + (normalY / length) * stateRadius * curveFactor * numStates;
            
            // Calculate points on the circles' edges
            const fromAngleToCP = Math.atan2(cpY - fromY, cpX - fromX);
            const startX = fromX + stateRadius * Math.cos(fromAngleToCP);
            const startY = fromY + stateRadius * Math.sin(fromAngleToCP);
            
            const toAngleFromCP = Math.atan2(cpY - toY, cpX - toX);
            const endX = toX + stateRadius * Math.cos(toAngleFromCP);
            const endY = toY + stateRadius * Math.sin(toAngleFromCP);
            
            // Draw arrow
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Draw arrowhead
            const arrowSize = 8;
            const arrowAngle = Math.atan2(endY - cpY, endX - cpX);
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
              endX - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
              endY - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
            );
            ctx.lineTo(
              endX - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
              endY - arrowSize * Math.sin(arrowAngle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = '#555';
            ctx.fill();
            
            // Draw symbol
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, cpX + 5, cpY - 5);
          }
        }
      });
    });
  }, [dfa]);
  
  return (
    <EditorContainer>
      <SectionTitle>Deterministic Finite Automaton (DFA) Editor</SectionTitle>
      <SectionDescription>
        Create and test your own DFA using the editor below. Define states, alphabet, transitions, and
        test input strings to see if they are accepted by your automaton.
      </SectionDescription>
      
      <TwoColumnLayout>
        <Panel>
          <PanelTitle>DFA Definition</PanelTitle>
          
          <FormGroup>
            <Label htmlFor="states">States (comma separated):</Label>
            <Input 
              type="text" 
              id="states" 
              value={dfa.states.join(', ')} 
              onChange={handleStatesChange} 
              placeholder="e.g., q0, q1, q2"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="alphabet">Alphabet (comma separated):</Label>
            <Input 
              type="text" 
              id="alphabet" 
              value={dfa.alphabet.join(', ')} 
              onChange={handleAlphabetChange} 
              placeholder="e.g., 0, 1"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="initialState">Initial State:</Label>
            <Input 
              type="text" 
              id="initialState" 
              value={dfa.initialState} 
              onChange={handleInitialStateChange} 
              list="states-list"
              placeholder="Starting state"
            />
            <datalist id="states-list">
              {dfa.states.map(state => (
                <option key={state} value={state} />
              ))}
            </datalist>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="acceptingStates">Accepting States (comma separated):</Label>
            <Input 
              type="text" 
              id="acceptingStates" 
              value={dfa.acceptingStates.join(', ')} 
              onChange={handleAcceptingStatesChange} 
              placeholder="e.g., q2"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Transition Function:</Label>
            <TransitionTable>
              <thead>
                <tr>
                  <th>State</th>
                  {dfa.alphabet.map(symbol => (
                    <th key={symbol}>{symbol}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dfa.states.map(state => (
                  <tr key={state}>
                    <td>{state}</td>
                    {dfa.alphabet.map(symbol => (
                      <td key={`${state}-${symbol}`}>
                        <select 
                          value={dfa.transitions[state]?.[symbol] || ''}
                          onChange={(e) => handleTransitionChange(state, symbol, e)}
                        >
                          {dfa.states.map(toState => (
                            <option key={toState} value={toState}>
                              {toState}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </TransitionTable>
          </FormGroup>
        </Panel>
        
        <Panel>
          <PanelTitle>DFA Visualization</PanelTitle>
          <Canvas ref={canvasRef} width={500} height={400} />
          
          <TestInputContainer>
            <Label htmlFor="testInput">Test Input String:</Label>
            <InputContainer>
              <TestInput 
                type="text" 
                id="testInput" 
                value={testInput} 
                onChange={(e) => setTestInput(e.target.value)} 
                placeholder={`e.g., ${dfa.alphabet.join('')}${dfa.alphabet[0] || ''}`}
              />
              <Button onClick={handleTestInput}>Test</Button>
            </InputContainer>
            
            <TestResult visible={testResult.visible} accepted={testResult.accepted}>
              {testResult.message}
            </TestResult>
          </TestInputContainer>
        </Panel>
      </TwoColumnLayout>
    </EditorContainer>
  );
};

export default DFAEditor;