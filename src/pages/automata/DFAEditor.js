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
  TransitionSelect,
  TestInputContainer,
  InputContainer,
  TestInput,
  TestResult
} from '../../components/automata/FormComponents';
import AutomataCanvas from '../../components/automata/AutomataCanvas';
import SimulationControls from '../../components/automata/SimulationControls';
import { DFAModel } from '../../utils/automata/AutomatonModel';
import CanvasManager from '../../utils/automata/CanvasManager';
import useSimulation from '../../hooks/useSimulation';

const DFAEditor = () => {
  // ===== STATE MANAGEMENT =====
  // Tab state
  const [activeTab, setActiveTab] = useState('definition');
  
  // DFA model
  const [dfa, setDfa] = useState(new DFAModel({
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    transitions: {
      q0: { '0': 'q0', '1': 'q1' },
      q1: { '0': 'q2', '1': 'q0' },
      q2: { '0': 'q1', '1': 'q2' }
    },
    initialState: 'q0',
    acceptingStates: ['q2']
  }));
  
  // Canvas management
  const canvasManagerRef = useRef(null);
  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);
  
  // Define tabs
  const tabs = [
    { id: 'definition', label: 'Definition' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'simulation', label: 'Simulation', disabled: !dfa || !dfa.alphabet || dfa.alphabet.length === 0 }
  ];
  
  // ===== FORM HANDLERS =====
  const handleStatesChange = (e) => {
    const statesStr = e.target.value;
    const statesList = statesStr.split(',').map(s => s.trim()).filter(s => s);
    
    // Create a new DFA with updated states
    const newDfa = new DFAModel({
      ...dfa.toJSON(),
      states: statesList
    });
    
    setDfa(newDfa);
    handleCanvasUpdate();
  };
  
  const handleAlphabetChange = (e) => {
    const alphabetStr = e.target.value;
    const alphabetList = alphabetStr.split(',').map(a => a.trim()).filter(a => a);
    
    // Create a new DFA with updated alphabet
    const newDfa = new DFAModel({
      ...dfa.toJSON(),
      alphabet: alphabetList
    });
    
    setDfa(newDfa);
  };
  
  const handleInitialStateChange = (e) => {
    const newDfa = new DFAModel({
      ...dfa.toJSON(),
      initialState: e.target.value
    });
    
    setDfa(newDfa);
    handleCanvasUpdate();
  };
  
  const handleAcceptingStatesChange = (e) => {
    const acceptingStatesStr = e.target.value;
    const acceptingStatesList = acceptingStatesStr.split(',').map(s => s.trim()).filter(s => s);
    
    const newDfa = new DFAModel({
      ...dfa.toJSON(),
      acceptingStates: acceptingStatesList
    });
    
    setDfa(newDfa);
    handleCanvasUpdate();
  };
  
  const handleTransitionChange = (fromState, symbol, e) => {
    const toState = e.target.value;
    
    // Create a deep copy of transitions to avoid mutation
    const newTransitions = JSON.parse(JSON.stringify(dfa.transitions));
    newTransitions[fromState][symbol] = toState;
    
    const newDfa = new DFAModel({
      ...dfa.toJSON(),
      transitions: newTransitions
    });
    
    setDfa(newDfa);
    handleCanvasUpdate();
  };
  
  // ===== SIMULATION INTEGRATION =====
  // DFA-specific simulation functions
  const computeNextState = useCallback((currentState, symbol) => {
    return dfa.computeNextState(currentState, symbol);
  }, [dfa]);
  
  const isAcceptingState = useCallback((state) => {
    return dfa.isAcceptingState(state);
  }, [dfa]);
  
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
    initialState: dfa.initialState,
    type: 'dfa',
    computeNextState,
    isAcceptingState,
    renderCallback: () => renderDFA(),
    defaultSpeed: 200
  });
  
  // ===== CANVAS RENDERING =====
  // Initialize canvas manager when canvas ref becomes available
  const initCanvasManager = useCallback((canvasRef) => {
    if (!canvasRef) return;
    
    canvasManagerRef.current = new CanvasManager(canvasRef, {
      stateRadius: 30,
      activeStateFill: 'rgba(52, 199, 89, 0.9)',
      activeStateStroke: 'rgba(52, 199, 89, 1)'
    });
    
    setIsCanvasInitialized(true);
  }, []);
  
  // Handle rendering the DFA on the canvas
  const renderDFA = useCallback(() => {
    if (!canvasManagerRef.current || !isCanvasInitialized) return;
    
    const manager = canvasManagerRef.current;
    
    // Clear canvas and apply transformations
    manager.clear();
    manager.applyTransform();
    
    // Calculate state positions if needed
    const positions = Object.keys(manager.statePositions).length === dfa.states.length
      ? manager.statePositions
      : manager.calculateStatePositions(dfa.states);
    
    // Draw transitions
    dfa.states.forEach(fromState => {
      const fromPos = positions[fromState];
      if (!fromPos) return;
      
      dfa.alphabet.forEach(symbol => {
        const toState = dfa.transitions[fromState][symbol];
        const toPos = positions[toState];
        if (!toPos) return;
        
        // Check if this transition is active in the simulation
        const isActive = simulationState.path.some((step, idx) => 
          idx > 0 && 
          step.fromState === fromState && 
          step.state === toState && 
          step.input === symbol
        );
        
        manager.drawTransition(fromState, toState, fromPos, toPos, {
          symbol,
          isActive
        });
      });
    });
    
    // Draw states
    dfa.states.forEach(state => {
      const pos = positions[state];
      if (!pos) return;
      
      // Determine if the state is active in the simulation
      const isActive = simulationState.currentState === state && simulationState.isRunning;
      const isAccepting = dfa.acceptingStates.includes(state);
      const isInitial = dfa.initialState === state;
      
      manager.drawState(state, pos, {
        isActive,
        isAccepting,
        isInitial
      });
    });
    
    // Reset transformation
    manager.resetTransform();
  }, [dfa, simulationState, isCanvasInitialized]);
  
  // Handle updating the canvas when DFA changes
  const handleCanvasUpdate = useCallback(() => {
    if (canvasManagerRef.current && (activeTab === 'visualization' || activeTab === 'simulation')) {
      requestAnimationFrame(() => {
        renderDFA();
      });
    }
  }, [activeTab, renderDFA]);
  
  // Update canvas rendering when tab changes
  useEffect(() => {
    if ((activeTab === 'visualization' || activeTab === 'simulation') && isCanvasInitialized) {
      renderDFA();
    }
  }, [activeTab, isCanvasInitialized, renderDFA]);
  
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
    renderFunction: renderDFA,
    isLoading: isLoading,
    variant: 'dfa',
    loadingMessage: activeTab === 'simulation' 
      ? 'Setting up simulation...' 
      : 'Preparing visualization...'
  };
  
  // ===== RENDER =====
  return (
    <EditorContainer>
      <SectionTitle>Deterministic Finite Automaton (DFA)</SectionTitle>
      <SectionDescription>
        A DFA is a finite state machine that accepts or rejects strings of symbols. It can be in exactly one state 
        at a time, and transitions to another state based on the current state and the input symbol.
      </SectionDescription>
      
      <MainLayout>
        <TabPanel 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          variant="dfa"
        />
        
        {activeTab === 'definition' && (
          <Panel>
            <PanelHeader>
              <PanelTitle>Define DFA</PanelTitle>
            </PanelHeader>
            
            <Form>
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
                            <TransitionSelect 
                              value={dfa.transitions[state]?.[symbol] || ''} 
                              options={dfa.states}
                              onChange={(e) => handleTransitionChange(state, symbol, e)}
                              variant="dfa"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </TransitionTable>
              </FormGroup>
              
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
                  <Button 
                    onClick={() => {
                      if (handleTestInput()) {
                        setActiveTab('simulation');
                      }
                    }}
                  >
                    Test DFA
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
              <PanelTitle>DFA Visualization</PanelTitle>
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
                  placeholder={`e.g., ${dfa.alphabet.join('')}${dfa.alphabet[0] || ''}`}
                />
                <Button 
                  onClick={() => {
                    if (handleTestInput()) {
                      setActiveTab('simulation');
                    }
                  }}
                >
                  Test DFA
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
              <PanelTitle>DFA Simulation</PanelTitle>
            </PanelHeader>
            
            <AutomataCanvas {...canvasProps} />
            
            <SimulationContainer>
              <SimulationControls
                simulationState={{
                  ...simulationState,
                  isAccepting: dfa.acceptingStates.includes(simulationState.currentState)
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
                variant="dfa"
                showCurrentStates={false}
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

export default DFAEditor;