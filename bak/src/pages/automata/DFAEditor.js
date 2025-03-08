import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(52, 199, 89, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const moveUpDown = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Main container for the entire DFA editor
const EditorContainer = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
  margin-bottom: var(--spacing-xxl);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xxl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60%;
    height: 4px;
    background: linear-gradient(90deg, var(--secondary-color), transparent);
    border-radius: 2px;
  }
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-lg);
  line-height: 1.7;
  max-width: 800px;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
`;

const Tab = styled.button`
  background: ${props => props.active ? 'var(--secondary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: ${props => props.active ? 'none' : '1px solid var(--border-color)'};
  padding: var(--spacing-md) var(--spacing-lg);
  margin-right: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? 'var(--secondary-color)' : 'rgba(0, 0, 0, 0.05)'};
    transform: translateY(-2px);
  }
`;

const Panel = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 20px var(--shadow-color);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  animation: ${fadeIn} 0.5s ease-out;
`;

const VisualizationPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 700px;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
`;

const PanelTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
`;

const Form = styled.form`
  display: grid;
  gap: var(--spacing-xl);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
`;

const Input = styled.input`
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 4px rgba(52, 199, 89, 0.2);
  }
`;

const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const TransitionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-md);
  
  th, td {
    padding: var(--spacing-md);
    text-align: center;
    border: 1px solid var(--border-color);
  }
  
  th {
    background-color: var(--background-color);
    font-weight: 600;
  }
  
  select {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-base);
  }
`;

const TestInputContainer = styled.div`
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
`;

// Help text component - Will be used in future updates
// const HelpText = styled.p`
//   color: var(--text-secondary);
//   margin-top: var(--spacing-sm);
//   font-size: var(--font-size-base);
// `;

const SimulationContainer = styled.div`
  margin-top: var(--spacing-xl);
`;

const SimulationTitle = styled.h4`
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: var(--spacing-sm);
    color: var(--secondary-color);
  }
`;

const SimulationControls = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
`;

const InputContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  align-items: center;
`;

const TestInput = styled.input`
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 4px rgba(52, 199, 89, 0.2);
  }
`;

const SpeedContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const SpeedLabel = styled.label`
  font-weight: 600;
  color: var(--text-secondary);
`;

const SpeedSlider = styled.input`
  appearance: none;
  width: 120px;
  height: 8px;
  border-radius: 4px;
  background: #e0e0e0;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--secondary-color);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--secondary-color);
    cursor: pointer;
  }
`;

const ControlButton = styled.button`
  background-color: ${props => props.primary ? 'var(--secondary-color)' : 'white'};
  color: ${props => props.primary ? 'white' : 'var(--secondary-color)'};
  border: 2px solid var(--secondary-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 600;
  font-size: var(--font-size-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    margin-right: 4px;
  }
`;

const TestResult = styled.div`
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.accepted ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)'};
  border: 2px solid ${props => props.accepted ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)'};
  color: ${props => props.accepted ? 'var(--secondary-color)' : 'var(--danger-color)'};
  font-weight: 600;
  font-size: var(--font-size-lg);
  display: ${props => props.visible ? 'block' : 'none'};
  animation: ${fadeIn} 0.3s ease-out;
`;

const CurrentInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  
  span {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid var(--border-color);
    margin: 0 1px;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    font-size: var(--font-size-lg);
    min-width: 40px;
    text-align: center;
  }
  
  span.current {
    border-color: var(--secondary-color);
    background-color: rgba(52, 199, 89, 0.1);
    animation: ${pulse} 1.5s infinite;
  }
  
  span.processed {
    background-color: #f0f0f0;
    color: var(--text-secondary);
  }
  
  span.remaining {
    background-color: white;
  }
`;

const StepInfo = styled.div`
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: #f8f9fa;
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--secondary-color);
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  font-weight: bold;
  animation: ${moveUpDown} 2s ease-in-out infinite;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px; /* Fixed standard height */
  margin-bottom: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background-color: #f8f9fa;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 2px solid var(--border-color);
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
  cursor: move; /* Show move cursor to indicate it can be moved */
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: ${props => props.visible ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--secondary-color);
  animation: ${rotate} 1s linear infinite;
  margin-bottom: var(--spacing-md);
`;

const LoadingText = styled.p`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--secondary-color);
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 5px;
  width: 150px;
  z-index: 10;
`;

const ZoomButton = styled.button`
  background-color: white;
  border: none;
  padding: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ResetZoomButton = styled(ZoomButton)`
  font-size: var(--font-size-base);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-md);
`;

const SimulationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

const DFAEditor = () => {
  // State for active tab (Definition, Visualization, Simulation)
  const [activeTab, setActiveTab] = useState('definition');

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

  // Test input for DFA
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState({ visible: false, accepted: false, message: '' });

  // Simulation state
  const [simulationState, setSimulationState] = useState({
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    currentState: '',
    processedInput: '',
    remainingInput: '',
    speed: 500, // ms per step
    isComplete: false,
    path: []
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Canvas state
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [statePositions, setStatePositions] = useState({});
  const animationRef = useRef(null);

  // Track if canvas has been initialized
  const canvasInitialized = useRef(false);

  // Form change handlers
  const handleStatesChange = (e) => {
    const statesStr = e.target.value;
    const statesList = statesStr.split(',').map(s => s.trim()).filter(s => s);
    
    // Update DFA states
    const updatedDFA = { ...dfa, states: statesList };
    
    // Initialize transitions for new states
    statesList.forEach(state => {
      if (!updatedDFA.transitions[state]) {
        updatedDFA.transitions[state] = {};
        dfa.alphabet.forEach(symbol => {
          updatedDFA.transitions[state][symbol] = statesList[0] || state;
        });
      }
    });
    
    // Filter transitions for removed states
    Object.keys(updatedDFA.transitions).forEach(state => {
      if (!statesList.includes(state)) {
        delete updatedDFA.transitions[state];
      }
    });
    
    // Update initial state if it was removed
    if (!statesList.includes(updatedDFA.initialState) && statesList.length > 0) {
      updatedDFA.initialState = statesList[0];
    }
    
    // Filter accepting states
    updatedDFA.acceptingStates = updatedDFA.acceptingStates.filter(state => 
      statesList.includes(state)
    );
    
    setDFA(updatedDFA);
  };

  const handleAlphabetChange = (e) => {
    const alphabetStr = e.target.value;
    const alphabetList = alphabetStr.split(',').map(a => a.trim()).filter(a => a);
    
    // Update DFA alphabet
    const updatedDFA = { ...dfa, alphabet: alphabetList };
    
    // Update transitions for each state with the new alphabet
    Object.keys(updatedDFA.transitions).forEach(state => {
      const stateTransitions = { ...updatedDFA.transitions[state] };
      
      // Add missing transitions for new symbols
      alphabetList.forEach(symbol => {
        if (!stateTransitions[symbol]) {
          stateTransitions[symbol] = updatedDFA.states[0] || state;
        }
      });
      
      // Remove transitions for deleted symbols
      Object.keys(stateTransitions).forEach(symbol => {
        if (!alphabetList.includes(symbol)) {
          delete stateTransitions[symbol];
        }
      });
      
      updatedDFA.transitions[state] = stateTransitions;
    });
    
    setDFA(updatedDFA);
  };

  const handleInitialStateChange = (e) => {
    setDFA({
      ...dfa,
      initialState: e.target.value
    });
  };

  const handleAcceptingStatesChange = (e) => {
    const acceptingStatesStr = e.target.value;
    const acceptingStatesList = acceptingStatesStr.split(',').map(s => s.trim()).filter(s => s);
    
    setDFA({
      ...dfa,
      acceptingStates: acceptingStatesList
    });
  };

  const handleTransitionChange = (fromState, symbol, e) => {
    const toState = e.target.value;
    
    setDFA({
      ...dfa,
      transitions: {
        ...dfa.transitions,
        [fromState]: {
          ...dfa.transitions[fromState],
          [symbol]: toState
        }
      }
    });
  };

  // Test the DFA with the current input
  const handleTestInput = () => {
    if (!testInput) {
      setTestResult({
        visible: true,
        accepted: false,
        message: "Please enter an input string to test."
      });
      return;
    }
    
    // Show the simulation tab
    setActiveTab('simulation');
    
    // Start simulation
    startSimulation();
  };
  
  // Start a step-by-step simulation with improved animation handling
  const startSimulation = () => {
    // Reset previous simulation
    stopSimulation();
    
    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    // Show loading while preparing animation
    setIsLoading(true);
    
    // Use requestAnimationFrame to ensure UI updates before starting simulation
    requestAnimationFrame(() => {
      // Set up initial simulation state
      setSimulationState({
        isRunning: true,
        isPaused: false,
        currentStep: 0,
        currentState: dfa.initialState,
        processedInput: '',
        remainingInput: testInput,
        speed: simulationState.speed,
        isComplete: false,
        path: [{ state: dfa.initialState, input: '' }]
      });
      
      // Hide loading indicator after setup is complete
      setTimeout(() => {
        setIsLoading(false);
        
        // Force redraw for initial state
        requestAnimationFrame(() => {
          renderDFA();
        });
      }, 500);
    });
  };
  
  // Pause simulation
  const pauseSimulation = () => {
    setSimulationState(prevState => ({
      ...prevState,
      isPaused: true
    }));
    
    // Clear any pending animation frame
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };
  
  // Resume simulation
  const resumeSimulation = () => {
    setSimulationState(prevState => ({
      ...prevState,
      isPaused: false
    }));
    
    // Continue simulation
    runSimulationStep();
  };
  
  // Stop simulation - complete reset of state
  const stopSimulation = () => {
    // Clear any pending animation frame
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    // Reset to initial state
    setSimulationState({
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      currentState: dfa.initialState,
      processedInput: '',
      remainingInput: testInput,
      speed: 500, // maintain current speed setting
      isComplete: false,
      path: []
    });
    
    setTestResult({ visible: false, accepted: false });
    
    // Redraw the visualization without active state
    setTimeout(() => {
      renderDFA();
    }, 50);
  };
  
  // Run a single step of the simulation - No circular dependencies
  const runSimulationStep = useCallback(() => {
    setSimulationState(prevState => {
      // If simulation is complete, do nothing
      if (prevState.isComplete || prevState.isPaused || !prevState.isRunning) {
        return prevState;
      }
      
      // Get current state and remaining input
      const { currentState, remainingInput, processedInput, path } = prevState;
      
      // If no input left, we're done
      if (remainingInput.length === 0) {
        // Check if final state is accepting
        const accepted = dfa.acceptingStates.includes(currentState);
        
        // Set test result
        setTestResult({
          visible: true,
          accepted,
          message: accepted 
            ? `Success! Input "${testInput}" is accepted by the DFA.` 
            : `Rejected! Input "${testInput}" ends in state ${currentState}, which is not an accepting state.`
        });
        
        return {
          ...prevState,
          isComplete: true
        };
      }
      
      // Process next character
      const nextChar = remainingInput[0];
      
      // Check if character is in alphabet
      if (!dfa.alphabet.includes(nextChar)) {
        setTestResult({
          visible: true,
          accepted: false,
          message: `Error: Character '${nextChar}' is not in the alphabet.`
        });
        
        return {
          ...prevState,
          isComplete: true
        };
      }
      
      // Find next state
      const nextState = dfa.transitions[currentState][nextChar];
      
      // Update path
      const newPath = [...path, { 
        state: nextState, 
        input: nextChar, 
        fromState: currentState,
        processedInput: processedInput + nextChar,
        remainingInput: remainingInput.slice(1)
      }];
      
      // Schedule next step with proper animation timing
      if (!prevState.isPaused && !prevState.isComplete) {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
        
        animationRef.current = setTimeout(() => {
          // Only schedule the next step, don't call renderDFA directly
          // This avoids circular dependencies
          requestAnimationFrame(() => {
            runSimulationStep();
          });
        }, prevState.speed);
      }
      
      return {
        ...prevState,
        currentStep: prevState.currentStep + 1,
        currentState: nextState,
        processedInput: processedInput + nextChar,
        remainingInput: remainingInput.slice(1),
        path: newPath
      };
    });
  }, [dfa, testInput, setTestResult]);
  // No circular dependencies with renderDFA
  
  // Handle step forward with forced rendering
  const handleStepForward = () => {
    if (simulationState.isComplete) return;
    
    if (!simulationState.isRunning) {
      startSimulation();
      return;
    }
    
    if (simulationState.isPaused) {
      // Run one step and then force redraw immediately
      runSimulationStep();
      setTimeout(() => renderDFA(), 10);
    }
  };
  
  // Handle step backward with forced rendering
  const handleStepBackward = () => {
    setSimulationState(prevState => {
      if (prevState.currentStep <= 0 || !prevState.isRunning) {
        return prevState;
      }
      
      const newPath = [...prevState.path];
      newPath.pop();
      const previousStep = newPath[newPath.length - 1];
      
      // Schedule an immediate redraw after state update
      setTimeout(() => renderDFA(), 10);
      
      return {
        ...prevState,
        currentStep: prevState.currentStep - 1,
        currentState: previousStep.state,
        processedInput: previousStep.processedInput || '',
        remainingInput: testInput.slice(previousStep.processedInput ? previousStep.processedInput.length : 0),
        isComplete: false,
        path: newPath
      };
    });
    
    // Clear test result
    setTestResult({ visible: false, accepted: false });
  };
  
  // Handle speed change
  const handleSpeedChange = (e) => {
    setSimulationState(prevState => ({
      ...prevState,
      speed: parseInt(e.target.value)
    }));
  };
  
  // Zoom handlers with redraw
  const handleZoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev + 0.1, 2.0);
      // Reset pan if needed to prevent getting stuck when zooming in
      if (newZoom > prev) {
        const canvas = canvasRef.current;
        if (canvas) {
          const maxPanX = canvas.width * (newZoom - 0.5);
          const maxPanY = canvas.height * (newZoom - 0.5);
          const minPanX = -maxPanX;
          const minPanY = -maxPanY;
          
          setPan(currentPan => ({
            x: Math.min(Math.max(currentPan.x, minPanX), maxPanX),
            y: Math.min(Math.max(currentPan.y, minPanY), maxPanY)
          }));
        }
      }
      // Ensure redraw
      setTimeout(() => renderDFA(), 10);
      return newZoom;
    });
  };
  
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.1, 0.5);
      // Ensure redraw
      setTimeout(() => renderDFA(), 10);
      return newZoom;
    });
  };
  
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    
    // Force redraw after resetting
    setTimeout(() => {
      renderDFA();
    }, 50);
  };
  
  // Pan handlers with boundary constraints
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Get canvas dimensions for boundary checking
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;
    
    // Calculate boundaries based on zoom level and canvas size
    const maxPanX = canvas.width * (zoom - 0.5);
    const maxPanY = canvas.height * (zoom - 0.5);
    const minPanX = -maxPanX;
    const minPanY = -maxPanY;
    
    // Apply pan with boundaries
    setPan(prev => ({ 
      x: Math.min(Math.max(prev.x + dx, minPanX), maxPanX),
      y: Math.min(Math.max(prev.y + dy, minPanY), maxPanY)
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Calculate state positions
  const calculateStatePositions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return {};
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Use simple scaling - no DPI adjustments to avoid bugs
    const numStates = dfa.states.length;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Use a simpler radius calculation to prevent overflow
    const radius = Math.min(width, height) * 0.35;
    
    const positions = {};
    
    dfa.states.forEach((state, index) => {
      const angle = (2 * Math.PI * index) / numStates;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      positions[state] = { x, y, angle };
    });
    
    return positions;
  }, [dfa.states]);
  
  // Canvas renderer with improved graphics
  const renderDFA = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Calculate state positions if not cached
    const positions = Object.keys(statePositions).length === dfa.states.length
      ? statePositions
      : calculateStatePositions();
    
    // If positions changed, update the cache
    if (positions !== statePositions) {
      setStatePositions(positions);
    }
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // Set up constants for drawing
    const stateRadius = 30;
    const activePath = simulationState.path || [];
    
    // Draw transitions first (to be behind states)
    dfa.states.forEach((fromState) => {
      const fromPos = positions[fromState];
      if (!fromPos) return;
      
      dfa.alphabet.forEach(symbol => {
        const toState = dfa.transitions[fromState][symbol];
        const toPos = positions[toState];
        if (!toPos) return;
        
        // Check if this transition is active in the simulation
        const isActive = activePath.some((step, idx) => 
          idx > 0 && 
          step.fromState === fromState && 
          step.state === toState && 
          step.input === symbol
        );
        
        // Self-loop
        if (fromState === toState) {
          const angle = fromPos.angle;
          const loopRadius = stateRadius * 0.8;
          const loopX = fromPos.x + stateRadius * 1.5 * Math.cos(angle - Math.PI / 4);
          const loopY = fromPos.y + stateRadius * 1.5 * Math.sin(angle - Math.PI / 4);
          
          // Loop shadow
          ctx.beginPath();
          ctx.arc(loopX, loopY + 3, loopRadius, 0, 2 * Math.PI, false);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Main loop
          ctx.beginPath();
          ctx.arc(loopX, loopY, loopRadius, 0, 2 * Math.PI, false);
          ctx.strokeStyle = isActive ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 0, 0, 0.6)';
          ctx.lineWidth = isActive ? 3 : 2;
          ctx.stroke();
          
          // Draw symbol
          const textX = loopX;
          const textY = loopY - loopRadius - 15;
          
          // Text background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = isActive ? 'bold 16px Arial' : '14px Arial';
          const textWidth = ctx.measureText(symbol).width + 10;
          ctx.fillRect(textX - textWidth/2, textY - 10, textWidth, 20);
          
          // Text
          ctx.fillStyle = isActive ? 'var(--secondary-color)' : 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbol, textX, textY);
        } 
        // Transition to another state
        else {
          // Calculate control point for curved line
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2;
          const normalX = -(toPos.y - fromPos.y);
          const normalY = toPos.x - fromPos.x;
          const length = Math.sqrt(normalX * normalX + normalY * normalY);
          const curveFactor = 0.2;
          const cpX = midX + (normalX / length) * stateRadius * curveFactor * dfa.states.length;
          const cpY = midY + (normalY / length) * stateRadius * curveFactor * dfa.states.length;
          
          // Calculate points on the circles' edges
          const fromAngleToCP = Math.atan2(cpY - fromPos.y, cpX - fromPos.x);
          const startX = fromPos.x + stateRadius * Math.cos(fromAngleToCP);
          const startY = fromPos.y + stateRadius * Math.sin(fromAngleToCP);
          
          const toAngleFromCP = Math.atan2(cpY - toPos.y, cpX - toPos.x);
          const endX = toPos.x + stateRadius * Math.cos(toAngleFromCP);
          const endY = toPos.y + stateRadius * Math.sin(toAngleFromCP);
          
          // Draw shadow
          ctx.beginPath();
          ctx.moveTo(startX, startY + 2);
          ctx.quadraticCurveTo(cpX, cpY + 2, endX, endY + 2);
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Draw arrow
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
          ctx.strokeStyle = isActive ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 0, 0, 0.6)';
          ctx.lineWidth = isActive ? 3 : 2;
          ctx.stroke();
          
          // Draw arrowhead
          const arrowSize = 10;
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
          ctx.fillStyle = isActive ? 'rgba(52, 199, 89, 0.8)' : 'rgba(0, 0, 0, 0.6)';
          ctx.fill();
          
          // Draw transition symbol
          const textX = cpX;
          const textY = cpY - 15;
          
          // Text background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = isActive ? 'bold 16px Arial' : '14px Arial';
          const textWidth = ctx.measureText(symbol).width + 10;
          ctx.fillRect(textX - textWidth/2, textY - 10, textWidth, 20);
          
          // Text
          ctx.fillStyle = isActive ? 'var(--secondary-color)' : 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(symbol, textX, textY);
        }
      });
    });
    
    // Draw states with enhanced styling
    dfa.states.forEach(state => {
      const pos = positions[state];
      if (!pos) return;
      
      // Determine if the state is active in the simulation
      const isActive = simulationState.currentState === state && simulationState.isRunning;
      const isAccepting = dfa.acceptingStates.includes(state);
      const isInitial = dfa.initialState === state;
      
      // Draw shadow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y + 3, stateRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fill();
      
      // Main circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, stateRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = isActive 
        ? 'rgba(52, 199, 89, 0.9)' 
        : 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isActive 
        ? 'rgba(52, 199, 89, 1)' 
        : 'rgba(0, 0, 0, 0.6)';
      ctx.stroke();
      
      // Second circle for accepting states
      if (isAccepting) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, stateRadius - 6, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = isActive 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(0, 0, 0, 0.6)';
        ctx.stroke();
      }
      
      // Arrow for initial state
      if (isInitial) {
        const arrowLength = stateRadius * 1.5;
        const arrowX = pos.x - Math.cos(Math.PI) * arrowLength;
        const arrowY = pos.y - Math.sin(Math.PI) * arrowLength;
        
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(pos.x - stateRadius, pos.y);
        ctx.strokeStyle = isActive 
          ? 'rgba(52, 199, 89, 1)' 
          : 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Arrow head
        const arrowSize = 10;
        const arrowAngle = 0; // Point right
        ctx.beginPath();
        ctx.moveTo(pos.x - stateRadius, pos.y);
        ctx.lineTo(
          pos.x - stateRadius - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
          pos.y - arrowSize * Math.sin(arrowAngle - Math.PI / 6)
        );
        ctx.lineTo(
          pos.x - stateRadius - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
          pos.y - arrowSize * Math.sin(arrowAngle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = isActive 
          ? 'rgba(52, 199, 89, 1)' 
          : 'rgba(0, 0, 0, 0.6)';
        ctx.fill();
      }
      
      // State label
      ctx.fillStyle = isActive ? 'white' : '#333';
      ctx.font = `bold ${isActive ? 16 : 14}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state, pos.x, pos.y);
    });
    
    // Restore context
    ctx.restore();
  }, [dfa, simulationState, pan, zoom, statePositions, calculateStatePositions]);
  
  // Initialize the canvas when the component mounts or when tab changes
  useEffect(() => {
    // Only run this effect when the visualization tab is active
    if (activeTab !== 'visualization' && activeTab !== 'simulation') {
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas || !canvasContainerRef.current) {
      return;
    }
    
    // Only set dimensions if not already set
    if (!canvasInitialized.current) {
      const container = canvasContainerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Set canvas dimensions WITHOUT any scaling factors
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      canvasInitialized.current = true;
    }
    
    // Render the DFA with current state
    renderDFA();
    
    // Clean up any pending animation
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [activeTab, renderDFA]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Reset canvas initialization flag so dimensions get updated
      canvasInitialized.current = false;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Effect for running simulation when not paused
  useEffect(() => {
    if (simulationState.isRunning && !simulationState.isPaused && !simulationState.isComplete) {
      runSimulationStep();
    }
  }, [simulationState.isRunning, simulationState.isPaused, simulationState.isComplete, runSimulationStep]);
  
  // Dedicated animation update effect to render canvas on simulation changes
  useEffect(() => {
    if ((activeTab === 'simulation' || activeTab === 'visualization') && 
        canvasRef.current && canvasContainerRef.current) {
      // Use requestAnimationFrame for smooth rendering aligned with browser refresh rate
      requestAnimationFrame(() => {
        renderDFA();
      });
    }
  }, [
    renderDFA, 
    activeTab, 
    simulationState.currentState, 
    simulationState.currentStep,
    simulationState.isRunning,
    simulationState.isPaused,
    simulationState.isComplete
  ]);
  
  // SVG icons for better UI
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
  
  const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  );
  
  const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v6h6"></path>
      <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
    </svg>
  );
  
  const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="19 20 9 12 19 4 19 20"></polygon>
      <line x1="5" y1="19" x2="5" y2="5"></line>
    </svg>
  );
  
  const ForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 4 15 12 5 20 5 4"></polygon>
      <line x1="19" y1="5" x2="19" y2="19"></line>
    </svg>
  );
  
  // These icons are for future implementation of toolbar buttons
  // Currently using text buttons for better accessibility
  // const ZoomInIcon = () => (
  //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //     <circle cx="11" cy="11" r="8"></circle>
  //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  //     <line x1="11" y1="8" x2="11" y2="14"></line>
  //     <line x1="8" y1="11" x2="14" y2="11"></line>
  //   </svg>
  // );
  // 
  // const ZoomOutIcon = () => (
  //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //     <circle cx="11" cy="11" r="8"></circle>
  //     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  //     <line x1="8" y1="11" x2="14" y2="11"></line>
  //   </svg>
  // );
  // 
  // const CenterIcon = () => (
  //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //     <circle cx="12" cy="12" r="10"></circle>
  //     <line x1="12" y1="8" x2="12" y2="16"></line>
  //     <line x1="8" y1="12" x2="16" y2="12"></line>
  //   </svg>
  // );
  
  return (
    <EditorContainer>
      <SectionTitle>Deterministic Finite Automaton (DFA)</SectionTitle>
      <SectionDescription>
        A DFA is a finite state machine that accepts or rejects strings of symbols. It can be in exactly one state 
        at a time, and transitions to another state based on the current state and the input symbol.
      </SectionDescription>
      
      <MainLayout>
        <TabContainer>
          <Tab 
            active={activeTab === 'definition'} 
            onClick={() => setActiveTab('definition')}
          >
            Definition
          </Tab>
          <Tab 
            active={activeTab === 'visualization'} 
            onClick={() => setActiveTab('visualization')}
          >
            Visualization
          </Tab>
          <Tab 
            active={activeTab === 'simulation'} 
            onClick={() => setActiveTab('simulation')}
            disabled={!testInput}
          >
            Simulation
          </Tab>
        </TabContainer>
        
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
                  <Button onClick={handleTestInput}>Test DFA</Button>
                </InputContainer>
              </TestInputContainer>
            </Form>
          </Panel>
        )}
        
        {activeTab === 'visualization' && (
          <VisualizationPanel>
            <PanelHeader>
              <PanelTitle>DFA Visualization</PanelTitle>
            </PanelHeader>
            
            <CanvasContainer 
              ref={canvasContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Canvas ref={canvasRef} />
              
              <LoadingOverlay visible={isLoading}>
                <LoadingSpinner />
                <LoadingText>Preparing visualization...</LoadingText>
              </LoadingOverlay>
              
              <ZoomControls>
                <ZoomButton onClick={handleZoomIn} title="Zoom In">+</ZoomButton>
                <ZoomButton onClick={handleZoomOut} title="Zoom Out">-</ZoomButton>
                <ResetZoomButton onClick={handleResetZoom} title="Reset View">Reset</ResetZoomButton>
                <div style={{ fontSize: '11px', marginTop: '5px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Drag to move the view
                </div>
              </ZoomControls>
            </CanvasContainer>
            
            <TestInputContainer>
              <Label htmlFor="testInput">Test Input String:</Label>
              <InputContainer>
                <TestInput 
                  type="text" 
                  id="testInputVis" 
                  value={testInput} 
                  onChange={(e) => setTestInput(e.target.value)} 
                  placeholder={`e.g., ${dfa.alphabet.join('')}${dfa.alphabet[0] || ''}`}
                />
                <Button onClick={handleTestInput}>Test DFA</Button>
              </InputContainer>
            </TestInputContainer>
          </VisualizationPanel>
        )}
        
        {activeTab === 'simulation' && (
          <VisualizationPanel>
            <PanelHeader>
              <PanelTitle>DFA Simulation</PanelTitle>
            </PanelHeader>
            
            <CanvasContainer 
              ref={canvasContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Canvas ref={canvasRef} />
              
              <LoadingOverlay visible={isLoading}>
                <LoadingSpinner />
                <LoadingText>Setting up simulation...</LoadingText>
              </LoadingOverlay>
              
              <ZoomControls>
                <ZoomButton onClick={handleZoomIn} title="Zoom In">+</ZoomButton>
                <ZoomButton onClick={handleZoomOut} title="Zoom Out">-</ZoomButton>
                <ResetZoomButton onClick={handleResetZoom} title="Reset View">Reset</ResetZoomButton>
                <div style={{ fontSize: '11px', marginTop: '5px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Drag to move the view
                </div>
              </ZoomControls>
            </CanvasContainer>
            
            <SimulationContainer>
              <SimulationTitle>
                <SimulationIcon /> Simulation Controls
              </SimulationTitle>
              
              <InputContainer>
                <TestInput 
                  type="text" 
                  id="testInputSim" 
                  value={testInput} 
                  onChange={(e) => setTestInput(e.target.value)} 
                  placeholder={`e.g., ${dfa.alphabet.join('')}${dfa.alphabet[0] || ''}`}
                />
                <Button onClick={startSimulation}>Restart</Button>
              </InputContainer>
              
              <CurrentInput>
                {simulationState.processedInput.split('').map((char, index) => (
                  <span key={`p-${index}`} className="processed">{char}</span>
                ))}
                
                {simulationState.remainingInput.split('').map((char, index) => {
                  if (index === 0) {
                    return <span key={`c-${index}`} className="current">{char}</span>;
                  }
                  return <span key={`r-${index}`} className="remaining">{char}</span>;
                })}
              </CurrentInput>
              
              <StepInfo>
                <InfoIcon>i</InfoIcon>
                Current State: <strong>{simulationState.currentState}</strong>
                {simulationState.isComplete && (
                  <span> (Final State: {dfa.acceptingStates.includes(simulationState.currentState) ? 'Accepting' : 'Non-accepting'})</span>
                )}
              </StepInfo>
              
              <TestResult 
                visible={testResult.visible}
                accepted={testResult.accepted}
              >
                {testResult.message}
              </TestResult>
              
              <SimulationControls>
                <ControlButton onClick={handleStepBackward} disabled={simulationState.currentStep === 0}>
                  <BackIcon /> Step Back
                </ControlButton>
                
                {simulationState.isPaused || simulationState.isComplete ? (
                  <ControlButton primary onClick={resumeSimulation} disabled={simulationState.isComplete}>
                    <PlayIcon /> Continue
                  </ControlButton>
                ) : (
                  <ControlButton primary onClick={pauseSimulation} disabled={!simulationState.isRunning || simulationState.isComplete}>
                    <PauseIcon /> Pause
                  </ControlButton>
                )}
                
                <ControlButton onClick={handleStepForward} disabled={simulationState.isComplete}>
                  <ForwardIcon /> Step Forward
                </ControlButton>
                
                <ControlButton onClick={stopSimulation} disabled={!simulationState.isRunning}>
                  <ResetIcon /> Reset
                </ControlButton>
              </SimulationControls>
              
              <SpeedContainer>
                <SpeedLabel>Speed:</SpeedLabel>
                <SpeedSlider 
                  type="range" 
                  min="100" 
                  max="1000" 
                  step="100" 
                  value={simulationState.speed}
                  onChange={handleSpeedChange}
                />
                <span>{simulationState.speed}ms</span>
              </SpeedContainer>
            </SimulationContainer>
          </VisualizationPanel>
        )}
      </MainLayout>
    </EditorContainer>
  );
};

export default DFAEditor;