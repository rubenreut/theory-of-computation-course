import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TabPanel from '../../components/automata/TabPanel';
import { 
  EditorContainer, 
  SectionTitle, 
  SectionDescription,
  MainLayout,
  Panel,
  VisualizationPanel,
  PanelHeader,
  PanelTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  TransitionTable,
  CheckboxLabel,
  TestInputContainer,
  InputContainer,
  TestInput,
  TestResult
} from '../../components/automata/FormComponents';
import AutomataCanvas from '../../components/automata/AutomataCanvas';
import SimulationControls from '../../components/automata/SimulationControls';
import { NFAModel } from '../../utils/automata/AutomatonModel';
import CanvasManager from '../../utils/automata/CanvasManager';
import useSimulation from '../../hooks/useSimulation';

const NFAEditor = () => {
  // ===== STATE MANAGEMENT =====
  // Tab state
  const [activeTab, setActiveTab] = useState('definition');
  
  // NFA model
  const [nfa, setNfa] = useState(new NFAModel({
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    transitions: {
      q0: { '0': ['q0', 'q1'], '1': ['q0'], 'ε': ['q1'] },
      q1: { '0': [], '1': ['q2'], 'ε': [] },
      q2: { '0': ['q1'], '1': ['q0', 'q1', 'q2'], 'ε': ['q0'] }
    },
    initialState: 'q0',
    acceptingStates: ['q2'],
    epsilonSymbol: 'ε',
    useEpsilonTransitions: true
  }));
  
  // Epsilon transitions
  const [showEpsilonTransitions, setShowEpsilonTransitions] = useState(true);
  
  // Canvas management
  const canvasManagerRef = useRef(null);
  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);
  
  // Define tabs
  const tabs = [
    { id: 'definition', label: 'Definition' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'simulation', label: 'Simulation', disabled: !nfa || !nfa.alphabet || nfa.alphabet.length === 0 }
  ];
  
  // ===== FORM HANDLERS =====
  const handleStatesChange = (e) => {
    const statesStr = e.target.value;
    const statesList = statesStr.split(',').map(s => s.trim()).filter(s => s);
    
    // Create a new NFA with updated states
    const newNfa = new NFAModel({
      ...nfa.toJSON(),
      states: statesList
    });
    
    setNfa(newNfa);
    handleCanvasUpdate();
  };
  
  const handleAlphabetChange = (e) => {
    const alphabetStr = e.target.value;
    const alphabetList = alphabetStr.split(',').map(a => a.trim()).filter(a => a);
    
    // Create a new NFA with updated alphabet
    const newNfa = new NFAModel({
      ...nfa.toJSON(),
      alphabet: alphabetList
    });
    
    setNfa(newNfa);
  };
  
  const handleInitialStateChange = (e) => {
    const newNfa = new NFAModel({
      ...nfa.toJSON(),
      initialState: e.target.value
    });
    
    setNfa(newNfa);
    handleCanvasUpdate();
  };
  
  const handleAcceptingStatesChange = (e) => {
    const acceptingStatesStr = e.target.value;
    const acceptingStatesList = acceptingStatesStr.split(',').map(s => s.trim()).filter(s => s);
    
    const newNfa = new NFAModel({
      ...nfa.toJSON(),
      acceptingStates: acceptingStatesList
    });
    
    setNfa(newNfa);
    handleCanvasUpdate();
  };
  
  const handleToggleEpsilonTransitions = () => {
    setShowEpsilonTransitions(!showEpsilonTransitions);
    
    const newNfa = new NFAModel({
      ...nfa.toJSON(),
      useEpsilonTransitions: !showEpsilonTransitions
    });
    
    setNfa(newNfa);
    handleCanvasUpdate();
  };
  
  const handleTransitionChange = (fromState, symbol, toState, checked) => {
    // Create a deep copy of transitions to avoid mutation
    const newTransitions = JSON.parse(JSON.stringify(nfa.transitions));
    
    if (checked) {
      // Add transition
      if (!newTransitions[fromState][symbol].includes(toState)) {
        newTransitions[fromState][symbol].push(toState);
      }
    } else {
      // Remove transition
      const index = newTransitions[fromState][symbol].indexOf(toState);
      if (index !== -1) {
        newTransitions[fromState][symbol].splice(index, 1);
      }
    }
    
    const newNfa = new NFAModel({
      ...nfa.toJSON(),
      transitions: newTransitions
    });
    
    setNfa(newNfa);
    handleCanvasUpdate();
  };
  
  // ===== SIMULATION INTEGRATION =====
  // NFA-specific simulation functions
  const computeNextStates = useCallback((currentStates, symbol) => {
    // Find next states from all current states
    let nextStatesFromChar = [];
    const transitions = [];
    
    currentStates.forEach(state => {
      const stateTransitions = nfa.transitions[state][symbol] || [];
      
      stateTransitions.forEach(nextState => {
        if (!nextStatesFromChar.includes(nextState)) {
          nextStatesFromChar.push(nextState);
          transitions.push({ fromState: state, toState: nextState, symbol });
        }
      });
    });
    
    // Apply epsilon closure if enabled
    const nextStates = nfa.useEpsilonTransitions 
      ? nfa.computeEpsilonClosure(nextStatesFromChar) 
      : nextStatesFromChar;
    
    // Determine if epsilon transitions were used
    const epsilonTransitions = nfa.useEpsilonTransitions && 
      nextStates.length > nextStatesFromChar.length;
    
    // Add details about epsilon transitions for visualization
    const epsilonDetails = [];
    if (epsilonTransitions) {
      // Find which states were added by epsilon closure
      const epsilonAddedStates = nextStates.filter(
        state => !nextStatesFromChar.includes(state)
      );
      
      epsilonAddedStates.forEach(state => {
        epsilonDetails.push({ toState: state, viaEpsilon: true });
      });
    }
    
    // Handle errors
    if (!nfa.alphabet.includes(symbol)) {
      return {
        error: `Error: Character '${symbol}' is not in the alphabet.`,
        nextStates: []
      };
    }
    
    return { nextStates, transitions, epsilonTransitions, epsilonDetails };
  }, [nfa]);
  
  const areAcceptingStates = useCallback((states) => {
    return states.some(state => nfa.acceptingStates.includes(state));
  }, [nfa]);
  
  const computeEpsilonClosure = useCallback((states) => {
    return nfa.computeEpsilonClosure(states);
  }, [nfa]);
  
  // Use the simulation hook
  const {
    simulationState,
    testResult,
    isLoading,
    testInput,
    setTestInput,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
    handleStepForward,
    handleStepBackward,
    handleSpeedChange,
    handleTestInput,
    cleanup
  } = useSimulation({
    initialState: nfa.initialState,
    initialStates: nfa.computeEpsilonClosure([nfa.initialState]),
    type: 'nfa',
    computeNextStates,
    areAcceptingStates,
    computeEpsilonClosure,
    renderCallback: () => renderNFA(),
    defaultSpeed: 500
  });
  
  // ===== CANVAS RENDERING =====
  // Initialize canvas manager when canvas ref becomes available
  const initCanvasManager = useCallback((canvasRef) => {
    if (!canvasRef) return;
    
    canvasManagerRef.current = new CanvasManager(canvasRef, {
      stateRadius: 30,
      activeStateFill: 'rgba(94, 92, 230, 0.9)',
      activeStateStroke: 'rgba(94, 92, 230, 1)'
    });
    
    setIsCanvasInitialized(true);
  }, []);
  
  // Handle rendering the NFA on the canvas
  const renderNFA = useCallback(() => {
    if (!canvasManagerRef.current || !isCanvasInitialized) return;
    
    const manager = canvasManagerRef.current;
    
    // Clear canvas and apply transformations
    manager.clear();
    manager.applyTransform();
    
    // Calculate state positions if needed
    const positions = Object.keys(manager.statePositions).length === nfa.states.length
      ? manager.statePositions
      : manager.calculateStatePositions(nfa.states);
    
    // Draw transitions
    nfa.states.forEach(fromState => {
      const fromPos = positions[fromState];
      if (!fromPos) return;
      
      // First draw regular transitions
      nfa.alphabet.forEach(symbol => {
        const toStates = nfa.transitions[fromState][symbol] || [];
        
        toStates.forEach(toState => {
          const toPos = positions[toState];
          if (!toPos) return;
          
          // Check if this transition is active in the simulation
          const isActive = simulationState.path.some((step, idx) => 
            idx > 0 && 
            step.transitions && 
            step.transitions.some(t => 
              t.fromState === fromState && 
              t.toState === toState && 
              t.symbol === symbol
            )
          );
          
          manager.drawTransition(fromState, toState, fromPos, toPos, {
            symbol,
            isActive,
            strokeColor: isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            textColor: isActive ? 'var(--tertiary-color)' : 'black'
          });
        });
      });
      
      // Then draw epsilon transitions if enabled
      if (showEpsilonTransitions) {
        const epsilonToStates = nfa.transitions[fromState]['ε'] || [];
        
        epsilonToStates.forEach(toState => {
          const toPos = positions[toState];
          if (!toPos) return;
          
          // Check if this epsilon transition is active
          const isActive = simulationState.path.some((step, idx) => 
            idx > 0 && 
            step.epsilonDetails && 
            step.epsilonDetails.some(e => e.toState === toState)
          );
          
          manager.drawTransition(fromState, toState, fromPos, toPos, {
            symbol: 'ε',
            isActive,
            isDashed: true,
            strokeColor: isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            textColor: isActive ? 'var(--tertiary-color)' : 'black'
          });
        });
      }
    });
    
    // Draw states
    nfa.states.forEach(state => {
      const pos = positions[state];
      if (!pos) return;
      
      // Determine if the state is active in the simulation
      const isActive = simulationState.currentStates && 
                       simulationState.currentStates.includes(state) && 
                       simulationState.isRunning;
      const isAccepting = nfa.acceptingStates.includes(state);
      const isInitial = nfa.initialState === state;
      
      manager.drawState(state, pos, {
        isActive,
        isAccepting,
        isInitial
      });
    });
    
    // Reset transformation
    manager.resetTransform();
  }, [nfa, simulationState, isCanvasInitialized, showEpsilonTransitions]);
  
  // Handle updating the canvas when NFA changes
  const handleCanvasUpdate = useCallback(() => {
    if (canvasManagerRef.current && (activeTab === 'visualization' || activeTab === 'simulation')) {
      requestAnimationFrame(() => {
        renderNFA();
      });
    }
  }, [activeTab, renderNFA]);
  
  // Update canvas rendering when tab changes
  useEffect(() => {
    if ((activeTab === 'visualization' || activeTab === 'simulation') && isCanvasInitialized) {
      renderNFA();
    }
  }, [activeTab, isCanvasInitialized, renderNFA]);
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
  
  // Prepare canvas props
  const canvasProps = {
    initRef: initCanvasManager,
    canvasManager: canvasManagerRef.current,
    renderFunction: renderNFA,
    isLoading: isLoading,
    variant: 'nfa',
    loadingMessage: activeTab === 'simulation' 
      ? 'Setting up simulation...' 
      : 'Preparing visualization...'
  };
  
  // ===== RENDER =====
  return (
    <EditorContainer>
      <SectionTitle variant="nfa">Non-deterministic Finite Automaton (NFA)</SectionTitle>
      <SectionDescription>
        An NFA is a finite-state machine where for some state and input symbol, the next state may be multiple 
        possible states or none at all. Unlike DFAs, NFAs can transition to multiple states for the same input symbol.
      </SectionDescription>
      
      <MainLayout>
        <TabPanel 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          variant="nfa"
        />
        
        {activeTab === 'definition' && (
          <Panel>
            <PanelHeader>
              <PanelTitle>Define NFA</PanelTitle>
            </PanelHeader>
            
            <Form>
              <FormGroup>
                <Label htmlFor="states">States (comma separated):</Label>
                <Input 
                  type="text" 
                  id="states" 
                  value={nfa.states.join(', ')} 
                  onChange={handleStatesChange} 
                  placeholder="e.g., q0, q1, q2"
                  variant="nfa"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="alphabet">Alphabet (comma separated):</Label>
                <Input 
                  type="text" 
                  id="alphabet" 
                  value={nfa.alphabet.join(', ')} 
                  onChange={handleAlphabetChange} 
                  placeholder="e.g., 0, 1"
                  variant="nfa"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="initialState">Initial State:</Label>
                <Input 
                  type="text" 
                  id="initialState" 
                  value={nfa.initialState} 
                  onChange={handleInitialStateChange} 
                  list="states-list"
                  placeholder="Starting state"
                  variant="nfa"
                />
                <datalist id="states-list">
                  {nfa.states.map(state => (
                    <option key={state} value={state} />
                  ))}
                </datalist>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="acceptingStates">Accepting States (comma separated):</Label>
                <Input 
                  type="text" 
                  id="acceptingStates" 
                  value={nfa.acceptingStates.join(', ')} 
                  onChange={handleAcceptingStatesChange} 
                  placeholder="e.g., q2"
                  variant="nfa"
                />
              </FormGroup>
              
              <FormGroup style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Label>Transition Function (check all applicable transitions):</Label>
                <CheckboxLabel variant="nfa">
                  <input 
                    type="checkbox"
                    checked={showEpsilonTransitions}
                    onChange={handleToggleEpsilonTransitions}
                  />
                  Show ε-transitions
                </CheckboxLabel>
              </FormGroup>
              
              <TransitionTable>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Symbol</th>
                    <th>To States</th>
                  </tr>
                </thead>
                <tbody>
                  {nfa.states.map(fromState => 
                    // Include epsilon transitions in table if they're enabled
                    (showEpsilonTransitions ? [...nfa.alphabet, 'ε'] : nfa.alphabet).map(symbol => (
                      <tr key={`${fromState}-${symbol}`}>
                        <td>{fromState}</td>
                        <td>{symbol}</td>
                        <td style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '5px' 
                        }}>
                          {nfa.states.map(toState => (
                            <CheckboxLabel key={`${fromState}-${symbol}-${toState}`} variant="nfa">
                              <input 
                                type="checkbox"
                                checked={nfa.transitions[fromState][symbol]?.includes(toState) || false}
                                onChange={(e) => handleTransitionChange(fromState, symbol, toState, e.target.checked)}
                              />
                              {toState}
                            </CheckboxLabel>
                          ))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </TransitionTable>
              
              <TestInputContainer>
                <Label htmlFor="testInput">Test Input String:</Label>
                <InputContainer>
                  <TestInput 
                    type="text" 
                    id="testInput" 
                    value={testInput} 
                    onChange={(e) => setTestInput(e.target.value)} 
                    placeholder={`e.g., ${nfa.alphabet.join('')}${nfa.alphabet[0] || ''}`}
                    variant="nfa"
                  />
                  <Button 
                    onClick={() => {
                      if (handleTestInput()) {
                        setActiveTab('simulation');
                      }
                    }}
                    variant="nfa"
                  >
                    Test NFA
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
        )}
        
        {activeTab === 'visualization' && (
          <VisualizationPanel>
            <PanelHeader>
              <PanelTitle>NFA Visualization</PanelTitle>
              <div>
                <CheckboxLabel variant="nfa">
                  <input 
                    type="checkbox"
                    checked={showEpsilonTransitions}
                    onChange={handleToggleEpsilonTransitions}
                  />
                  Show ε-transitions
                </CheckboxLabel>
              </div>
            </PanelHeader>
            
            <AutomataCanvas {...canvasProps} />
            
            <TestInputContainer>
              <Label htmlFor="testInputVis">Test Input String:</Label>
              <InputContainer>
                <TestInput 
                  type="text" 
                  id="testInputVis" 
                  value={testInput} 
                  onChange={(e) => setTestInput(e.target.value)} 
                  placeholder={`e.g., ${nfa.alphabet.join('')}${nfa.alphabet[0] || ''}`}
                  variant="nfa"
                />
                <Button 
                  onClick={() => {
                    if (handleTestInput()) {
                      setActiveTab('simulation');
                    }
                  }}
                  variant="nfa"
                >
                  Test NFA
                </Button>
              </InputContainer>
              
              <TestResult 
                visible={testResult.visible}
                accepted={testResult.accepted}
              >
                {testResult.message}
              </TestResult>
            </TestInputContainer>
          </VisualizationPanel>
        )}
        
        {activeTab === 'simulation' && (
          <VisualizationPanel>
            <PanelHeader>
              <PanelTitle>NFA Simulation</PanelTitle>
              <div>
                <CheckboxLabel variant="nfa">
                  <input 
                    type="checkbox"
                    checked={showEpsilonTransitions}
                    onChange={handleToggleEpsilonTransitions}
                  />
                  Include ε-transitions
                </CheckboxLabel>
              </div>
            </PanelHeader>
            
            <AutomataCanvas {...canvasProps} />
            
            <SimulationContainer>
              <SimulationControls
                simulationState={{
                  ...simulationState,
                  isAccepting: simulationState.currentStates && 
                               simulationState.currentStates.some(state => 
                                 nfa.acceptingStates.includes(state)
                               )
                }}
                testInput={testInput}
                setTestInput={setTestInput}
                startSimulation={startSimulation}
                pauseSimulation={pauseSimulation}
                resumeSimulation={resumeSimulation}
                stopSimulation={stopSimulation}
                handleStepForward={handleStepForward}
                handleStepBackward={handleStepBackward}
                handleSpeedChange={handleSpeedChange}
                variant="nfa"
                showCurrentStates={true}
              />
              
              <TestResult 
                visible={testResult.visible}
                accepted={testResult.accepted}
              >
                {testResult.message}
              </TestResult>
            </SimulationContainer>
          </VisualizationPanel>
        )}
      </MainLayout>
    </EditorContainer>
  );
};

// Additional styled component for the simulation container
const SimulationContainer = styled.div`
  margin-top: var(--spacing-xl);
`;

export default NFAEditor;