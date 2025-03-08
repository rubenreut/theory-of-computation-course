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
    box-shadow: 0 0 0 0 rgba(94, 92, 230, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(94, 92, 230, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(94, 92, 230, 0);
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

// Main container for the entire NFA editor
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
    background: linear-gradient(90deg, var(--tertiary-color), transparent);
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
  background: ${props => props.active ? 'var(--tertiary-color)' : 'transparent'};
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
    background-color: ${props => props.active ? 'var(--tertiary-color)' : 'rgba(0, 0, 0, 0.05)'};
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
    border-color: var(--tertiary-color);
    box-shadow: 0 0 0 4px rgba(94, 92, 230, 0.2);
  }
`;

const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--tertiary-color);
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
    color: var(--tertiary-color);
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
    border-color: var(--tertiary-color);
    box-shadow: 0 0 0 4px rgba(94, 92, 230, 0.2);
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
    background: var(--tertiary-color);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--tertiary-color);
    cursor: pointer;
  }
`;

const ControlButton = styled.button`
  background-color: ${props => props.primary ? 'var(--tertiary-color)' : 'white'};
  color: ${props => props.primary ? 'white' : 'var(--tertiary-color)'};
  border: 2px solid var(--tertiary-color);
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
  color: ${props => props.accepted ? 'var(--success-color)' : 'var(--danger-color)'};
  font-weight: 600;
  font-size: var(--font-size-lg);
  display: ${props => props.visible ? 'block' : 'none'};
  animation: ${fadeIn} 0.3s ease-out;
`;

// Commented out to fix unused variable warning
// const StepDisplay = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-bottom: var(--spacing-lg);
//   background-color: #f8f9fa;
//   padding: var(--spacing-md);
//   border-radius: var(--border-radius-md);
//   font-weight: 600;
//   color: var(--text-secondary);
// `;

const CurrentInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  
  span {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid var(--border-color);
    margin: 3px;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    font-size: var(--font-size-lg);
    min-width: 40px;
    text-align: center;
  }
  
  span.current {
    border-color: var(--tertiary-color);
    background-color: rgba(94, 92, 230, 0.1);
    animation: ${pulse} 1.5s infinite;
  }
  
  span.processed {
    background-color: #f0f0f0;
    color: var(--text-secondary);
  }
  
  span.remaining {
    background-color: white;
  }
  
  span.path-marker {
    background-color: transparent;
    border: none;
    font-weight: bold;
    padding: 0 5px;
  }
`;

// Commented out to fix unused variable warning
// const PathVisualization = styled.div`
//   margin-bottom: var(--spacing-lg);
//   background-color: #f8f9fa;
//   padding: var(--spacing-md);
//   border-radius: var(--border-radius-md);
//   
//   .state-node {
//     display: inline-block;
//     padding: 10px 15px;
//     border-radius: 50%;
//     background-color: white;
//     border: 2px solid var(--tertiary-color);
//     margin: 0 10px;
//     font-weight: bold;
//   }
//   
//   .state-node.active {
//     background-color: rgba(94, 92, 230, 0.1);
//   }
//   
//   .arrow {
//     display: inline-block;
//     margin: 0 5px;
//     color: var(--text-secondary);
//     font-weight: bold;
//   }
//   
//   .symbol {
//     font-family: monospace;
//     background-color: #eee;
//     padding: 4px 8px;
//     border-radius: 4px;
//     margin-right: 5px;
//   }
// `;

const SymbolBadge = styled.span`
  display: inline-block;
  background-color: rgba(94, 92, 230, 0.1);
  color: var(--tertiary-color);
  font-size: var(--font-size-base);
  padding: 4px 8px;
  border-radius: 12px;
  margin: 0 3px;
  font-weight: 600;
`;

const StepInfo = styled.div`
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: #f8f9fa;
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--tertiary-color);
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--tertiary-color);
  color: white;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  font-weight: bold;
  animation: ${moveUpDown} 2s ease-in-out infinite;
`;

// Commented out to fix unused variable warning
// const MultiStateDisplay = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 10px;
//   margin-bottom: var(--spacing-lg);
//   
//   span {
//     display: inline-block;
//     padding: 8px 15px;
//     background-color: rgba(94, 92, 230, 0.1);
//     border: 1px solid var(--tertiary-color);
//     border-radius: 20px;
//     color: var(--tertiary-color);
//     font-weight: 600;
//   }
// `;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--tertiary-color);
  }
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px; /* Fixed reasonable height */
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
  border-top-color: var(--tertiary-color);
  animation: ${rotate} 1s linear infinite;
  margin-bottom: var(--spacing-md);
`;

const LoadingText = styled.p`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--tertiary-color);
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

const NFAEditor = () => {
  // State for active tab (Definition, Visualization, Simulation)
  const [activeTab, setActiveTab] = useState('definition');

  // Initial NFA state
  const [nfa, setNFA] = useState({
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    transitions: {
      q0: { '0': ['q0', 'q1'], '1': ['q0'], 'ε': ['q1'] },
      q1: { '0': [], '1': ['q2'], 'ε': [] },
      q2: { '0': ['q1'], '1': ['q0', 'q1', 'q2'], 'ε': ['q0'] }
    },
    initialState: 'q0',
    acceptingStates: ['q2']
  });

  // Test input for NFA
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState({ visible: false, accepted: false, message: '' });

  // Simulation state
  const [simulationState, setSimulationState] = useState({
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    currentStates: [],
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
  // Epsilon transition support
  const [showEpsilonTransitions, setShowEpsilonTransitions] = useState(true);
  const [epsilonSymbol, setEpsilonSymbol] = useState('ε');

  // Track if canvas has been initialized
  const canvasInitialized = useRef(false);

  // Form change handlers
  const handleStatesChange = (e) => {
    const statesStr = e.target.value;
    const statesList = statesStr.split(',').map(s => s.trim()).filter(s => s);
    
    // Update NFA states
    const updatedNFA = { ...nfa, states: statesList };
    
    // Initialize transitions for new states
    statesList.forEach(state => {
      if (!updatedNFA.transitions[state]) {
        updatedNFA.transitions[state] = {};
        nfa.alphabet.forEach(symbol => {
          updatedNFA.transitions[state][symbol] = [];
        });
      }
    });
    
    // Filter transitions for removed states
    Object.keys(updatedNFA.transitions).forEach(state => {
      if (!statesList.includes(state)) {
        delete updatedNFA.transitions[state];
      } else {
        // Remove transitions to states that no longer exist
        Object.keys(updatedNFA.transitions[state]).forEach(symbol => {
          updatedNFA.transitions[state][symbol] = updatedNFA.transitions[state][symbol].filter(
            toState => statesList.includes(toState)
          );
        });
      }
    });
    
    // Update initial state if it was removed
    if (!statesList.includes(updatedNFA.initialState) && statesList.length > 0) {
      updatedNFA.initialState = statesList[0];
    }
    
    // Filter accepting states
    updatedNFA.acceptingStates = updatedNFA.acceptingStates.filter(state => 
      statesList.includes(state)
    );
    
    setNFA(updatedNFA);
  };

  const handleAlphabetChange = (e) => {
    const alphabetStr = e.target.value;
    const alphabetList = alphabetStr.split(',').map(a => a.trim()).filter(a => a);
    
    // Update NFA alphabet
    const updatedNFA = { ...nfa, alphabet: alphabetList };
    
    // Update transitions for each state with the new alphabet
    Object.keys(updatedNFA.transitions).forEach(state => {
      const stateTransitions = { ...updatedNFA.transitions[state] };
      
      // Add missing transitions for new symbols
      alphabetList.forEach(symbol => {
        if (!stateTransitions[symbol]) {
          stateTransitions[symbol] = [];
        }
      });
      
      // Remove transitions for deleted symbols
      Object.keys(stateTransitions).forEach(symbol => {
        if (!alphabetList.includes(symbol)) {
          delete stateTransitions[symbol];
        }
      });
      
      updatedNFA.transitions[state] = stateTransitions;
    });
    
    setNFA(updatedNFA);
  };

  const handleInitialStateChange = (e) => {
    setNFA({
      ...nfa,
      initialState: e.target.value
    });
  };

  const handleAcceptingStatesChange = (e) => {
    const acceptingStatesStr = e.target.value;
    const acceptingStatesList = acceptingStatesStr.split(',').map(s => s.trim()).filter(s => s);
    
    setNFA({
      ...nfa,
      acceptingStates: acceptingStatesList
    });
  };

  const handleTransitionChange = (fromState, symbol, toState, checked) => {
    const currentTransitions = [...nfa.transitions[fromState][symbol]];
    
    if (checked && !currentTransitions.includes(toState)) {
      // Add transition
      currentTransitions.push(toState);
    } else if (!checked && currentTransitions.includes(toState)) {
      // Remove transition
      const index = currentTransitions.indexOf(toState);
      currentTransitions.splice(index, 1);
    }
    
    setNFA({
      ...nfa,
      transitions: {
        ...nfa.transitions,
        [fromState]: {
          ...nfa.transitions[fromState],
          [symbol]: currentTransitions
        }
      }
    });
  };

  // Test the NFA with the current input
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
  
  // Start a step-by-step simulation with improved animation handling and epsilon support
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
      // Apply epsilon closure to initial state if epsilon transitions are enabled
      const initialStates = computeEpsilonClosure([nfa.initialState]);
      
      // Set up initial simulation state
      setSimulationState({
        isRunning: true,
        isPaused: false,
        currentStep: 0,
        currentStates: initialStates,
        processedInput: '',
        remainingInput: testInput,
        speed: simulationState.speed,
        isComplete: false,
        path: [{ 
          states: initialStates, 
          input: '', 
          epsilonTransitions: initialStates.length > 1 ? true : false
        }]
      });
      
      // Hide loading indicator after setup is complete
      setTimeout(() => {
        setIsLoading(false);
        
        // Force redraw for initial state
        requestAnimationFrame(() => {
          renderNFA();
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
    
    // Apply epsilon closure to initial state
    const initialStates = computeEpsilonClosure([nfa.initialState]);
    
    // Reset to initial state
    setSimulationState({
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      currentStates: initialStates,
      processedInput: '',
      remainingInput: testInput,
      speed: simulationState.speed, // maintain current speed setting
      isComplete: false,
      path: []
    });
    
    setTestResult({ visible: false, accepted: false });
    
    // Redraw the visualization without active state
    setTimeout(() => {
      renderNFA();
    }, 50);
  };
  
  // Run a single step of the simulation with epsilon transition support
  const runSimulationStep = useCallback(() => {
    setSimulationState(prevState => {
      // If simulation is complete, do nothing
      if (prevState.isComplete || prevState.isPaused || !prevState.isRunning) {
        return prevState;
      }
      
      // Get current states and remaining input
      const { currentStates, remainingInput, processedInput, path } = prevState;
      
      // If no input left, we're done
      if (remainingInput.length === 0) {
        // Check if any current state is accepting
        const accepted = currentStates.some(state => nfa.acceptingStates.includes(state));
        
        // Set test result
        setTestResult({
          visible: true,
          accepted,
          message: accepted 
            ? `Success! Input "${testInput}" is accepted by the NFA.` 
            : `Rejected! Input "${testInput}" ends in states [${currentStates.join(', ')}], none of which are accepting states.`
        });
        
        return {
          ...prevState,
          isComplete: true
        };
      }
      
      // Process next character
      const nextChar = remainingInput[0];
      
      // Check if character is in alphabet
      if (!nfa.alphabet.includes(nextChar)) {
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
      
      // Find next states from all current states with their transitions
      let nextStatesFromChar = [];
      const transitionDetails = [];
      
      currentStates.forEach(state => {
        const stateTransitions = nfa.transitions[state][nextChar] || [];
        
        stateTransitions.forEach(nextState => {
          if (!nextStatesFromChar.includes(nextState)) {
            nextStatesFromChar.push(nextState);
            transitionDetails.push({ fromState: state, toState: nextState, symbol: nextChar });
          }
        });
      });
      
      // Apply epsilon closure to the next states if enabled
      const nextStates = computeEpsilonClosure(nextStatesFromChar);
      
      // Track epsilon transitions added during closure computation
      const epsilonTransitionDetails = [];
      if (showEpsilonTransitions && nextStates.length > nextStatesFromChar.length) {
        // Find which states were added by epsilon closure
        const epsilonAddedStates = nextStates.filter(state => !nextStatesFromChar.includes(state));
        
        // For simplicity, just note that these states were added via epsilon transitions
        // A more accurate tracking would be complex, but this is sufficient for visualization
        epsilonAddedStates.forEach(state => {
          epsilonTransitionDetails.push({ toState: state, viaEpsilon: true });
        });
      }
      
      // If no valid transitions, reject
      if (nextStates.length === 0) {
        setTestResult({
          visible: true,
          accepted: false,
          message: `Rejected! No valid transitions from states [${currentStates.join(', ')}] on input '${nextChar}'.`
        });
        
        return {
          ...prevState,
          isComplete: true
        };
      }
      
      // Update path
      const newPath = [...path, { 
        states: nextStates, 
        input: nextChar, 
        fromStates: currentStates,
        processedInput: processedInput + nextChar,
        remainingInput: remainingInput.slice(1),
        transitions: transitionDetails,
        epsilonTransitions: epsilonTransitionDetails.length > 0,
        epsilonDetails: epsilonTransitionDetails
      }];
      
      // Schedule next step with proper animation timing
      if (!prevState.isPaused && !prevState.isComplete) {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
        
        animationRef.current = setTimeout(() => {
          // Only schedule the next step, don't call renderNFA directly
          // This avoids circular dependencies
          requestAnimationFrame(() => {
            runSimulationStep();
          });
        }, prevState.speed);
      }
      
      return {
        ...prevState,
        currentStep: prevState.currentStep + 1,
        currentStates: nextStates,
        processedInput: processedInput + nextChar,
        remainingInput: remainingInput.slice(1),
        path: newPath
      };
    });
  }, [nfa, testInput, setTestResult, showEpsilonTransitions, computeEpsilonClosure, epsilonSymbol]);
  // No circular dependencies with renderNFA
  
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
      setTimeout(() => renderNFA(), 10);
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
      setTimeout(() => renderNFA(), 10);
      
      return {
        ...prevState,
        currentStep: prevState.currentStep - 1,
        currentStates: previousStep.states,
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
  
  // Toggle epsilon transitions
  const handleToggleEpsilonTransitions = () => {
    setShowEpsilonTransitions(prev => !prev);
    // Re-render the NFA
    setTimeout(() => renderNFA(), 10);
  };
  
  // Compute epsilon closure of a set of states
  const computeEpsilonClosure = (states) => {
    if (!showEpsilonTransitions) return states;
    
    const closure = [...states];
    const stack = [...states];
    
    while (stack.length > 0) {
      const state = stack.pop();
      const epsilonTransitions = nfa.transitions[state] && nfa.transitions[state][epsilonSymbol];
      
      if (epsilonTransitions && epsilonTransitions.length > 0) {
        epsilonTransitions.forEach(nextState => {
          if (!closure.includes(nextState)) {
            closure.push(nextState);
            stack.push(nextState);
          }
        });
      }
    }
    
    return closure;
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
      setTimeout(() => renderNFA(), 10);
      return newZoom;
    });
  };
  
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.1, 0.5);
      // Ensure redraw
      setTimeout(() => renderNFA(), 10);
      return newZoom;
    });
  };
  
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    
    // Force redraw after resetting
    setTimeout(() => {
      renderNFA();
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
    const numStates = nfa.states.length;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Use a simpler radius calculation to prevent overflow
    const radius = Math.min(width, height) * 0.35;
    
    const positions = {};
    
    nfa.states.forEach((state, index) => {
      const angle = (2 * Math.PI * index) / numStates;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      positions[state] = { x, y, angle };
    });
    
    return positions;
  }, [nfa.states]);
  
  // Canvas renderer with improved graphics
  const renderNFA = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Calculate state positions if not cached
    const positions = Object.keys(statePositions).length === nfa.states.length
      ? statePositions
      : calculateStatePositions();
    
    // If positions changed, update the cache
    if (positions !== statePositions) {
      setStatePositions(positions);
    }
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Apply zoom and pan
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // Set up constants for drawing
    const stateRadius = 30;
    const activePath = simulationState.path || [];
    const currentStates = simulationState.currentStates || [];
    
    // Draw transitions first (to be behind states)
    nfa.states.forEach((fromState) => {
      const fromPos = positions[fromState];
      if (!fromPos) return;
      
      // Handle both regular alphabet and epsilon transitions
      const symbolsToRender = showEpsilonTransitions 
        ? [...nfa.alphabet, epsilonSymbol] 
        : nfa.alphabet;
        
      symbolsToRender.forEach(symbol => {
        const toStates = nfa.transitions[fromState][symbol] || [];
        
        toStates.forEach(toState => {
          const toPos = positions[toState];
          if (!toPos) return;
          
          // Check if this transition is active in the simulation
          let isActive = activePath.some((step, idx) => 
            idx > 0 && 
            step.transitions && 
            step.transitions.some(t => 
              t.fromState === fromState && 
              t.toState === toState && 
              t.symbol === symbol
            )
          );
          
          // Special styling for epsilon transitions
          const isEpsilon = symbol === epsilonSymbol;
          
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
            
            // Style based on transition type and state
            if (isEpsilon) {
              // Dashed line for epsilon transitions
              ctx.setLineDash([5, 3]);
              ctx.strokeStyle = isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)';
            } else {
              ctx.setLineDash([]);
              ctx.strokeStyle = isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)';
            }
            
            ctx.lineWidth = isActive ? 3 : 2;
            ctx.stroke();
            
            // Reset dash pattern
            ctx.setLineDash([]);
            
            // Draw symbol
            const textX = loopX;
            const textY = loopY - loopRadius - 15;
            
            // Text background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = isActive ? 'bold 16px Arial' : '14px Arial';
            const textWidth = ctx.measureText(symbol).width + 10;
            ctx.fillRect(textX - textWidth/2, textY - 10, textWidth, 20);
            
            // Text
            ctx.fillStyle = isActive ? 'var(--tertiary-color)' : 'black';
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
            
            // Adjust curve factor based on NFA complexity
            const curveFactor = 0.2;
            const cpX = midX + (normalX / length) * stateRadius * curveFactor * nfa.states.length;
            const cpY = midY + (normalY / length) * stateRadius * curveFactor * nfa.states.length;
            
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
            
            // Style based on transition type and state
            if (isEpsilon) {
              // Dashed line for epsilon transitions
              ctx.setLineDash([5, 3]);
              ctx.strokeStyle = isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)';
            } else {
              ctx.setLineDash([]);
              ctx.strokeStyle = isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)';
            }
            
            ctx.lineWidth = isActive ? 3 : 2;
            ctx.stroke();
            
            // Reset dash pattern
            ctx.setLineDash([]);
            
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
            ctx.fillStyle = isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)';
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
            ctx.fillStyle = isActive ? 'var(--tertiary-color)' : 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol, textX, textY);
          }
        });
      });
    });
    
    // Draw states with enhanced styling
    nfa.states.forEach(state => {
      const pos = positions[state];
      if (!pos) return;
      
      // Determine if the state is active in the simulation
      const isActive = currentStates.includes(state) && simulationState.isRunning;
      const isAccepting = nfa.acceptingStates.includes(state);
      const isInitial = nfa.initialState === state;
      
      // Draw shadow
      ctx.beginPath();
      ctx.arc(pos.x, pos.y + 3, stateRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fill();
      
      // Main circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, stateRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = isActive 
        ? 'rgba(94, 92, 230, 0.9)' 
        : 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isActive 
        ? 'rgba(94, 92, 230, 1)' 
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
          ? 'rgba(94, 92, 230, 1)' 
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
          ? 'rgba(94, 92, 230, 1)' 
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
  }, [nfa, simulationState, pan, zoom, statePositions, calculateStatePositions]);
  
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
    
    // Render the NFA with current state
    renderNFA();
    
    // Clean up any pending animation
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [activeTab, renderNFA]);
  
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
        renderNFA();
      });
    }
  }, [
    renderNFA, 
    activeTab, 
    simulationState.currentStates, 
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
      <SectionTitle>Non-deterministic Finite Automaton (NFA)</SectionTitle>
      <SectionDescription>
        An NFA is a finite-state machine where for some state and input symbol, the next state may be multiple possible states or none at all.
        Unlike DFAs, NFAs can transition to multiple states for the same input symbol.
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
                />
              </FormGroup>
              
              <FormGroup style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Label>Transition Function (check all applicable transitions):</Label>
                <CheckboxLabel>
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
                    (showEpsilonTransitions ? [...nfa.alphabet, epsilonSymbol] : nfa.alphabet).map(symbol => (
                        <tr key={`${fromState}-${symbol}`}>
                          <td>{fromState}</td>
                          <td>{symbol}</td>
                          <td style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {nfa.states.map(toState => (
                              <CheckboxLabel key={`${fromState}-${symbol}-${toState}`}>
                                <input 
                                  type="checkbox"
                                  checked={nfa.transitions[fromState][symbol].includes(toState)}
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
              </FormGroup>
              
              <TestInputContainer>
                <Label htmlFor="testInput">Test Input String:</Label>
                <InputContainer>
                  <TestInput 
                    type="text" 
                    id="testInput" 
                    value={testInput} 
                    onChange={(e) => setTestInput(e.target.value)} 
                    placeholder={`e.g., ${nfa.alphabet.join('')}${nfa.alphabet[0] || ''}`}
                  />
                  <Button onClick={handleTestInput}>Test NFA</Button>
                </InputContainer>
              </TestInputContainer>
            </Form>
          </Panel>
        )}
        
        {activeTab === 'visualization' && (
          <VisualizationPanel>
            <PanelHeader>
              <PanelTitle>NFA Visualization</PanelTitle>
              <div>
                <CheckboxLabel>
                  <input 
                    type="checkbox"
                    checked={showEpsilonTransitions}
                    onChange={handleToggleEpsilonTransitions}
                  />
                  Show ε-transitions
                </CheckboxLabel>
              </div>
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
                  placeholder={`e.g., ${nfa.alphabet.join('')}${nfa.alphabet[0] || ''}`}
                />
                <Button onClick={handleTestInput}>Test NFA</Button>
              </InputContainer>
            </TestInputContainer>
          </VisualizationPanel>
        )}
        
        {activeTab === 'simulation' && (
          <VisualizationPanel>
            <PanelHeader>
              <PanelTitle>NFA Simulation</PanelTitle>
              <div>
                <CheckboxLabel>
                  <input 
                    type="checkbox"
                    checked={showEpsilonTransitions}
                    onChange={handleToggleEpsilonTransitions}
                  />
                  Include ε-transitions
                </CheckboxLabel>
              </div>
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
                  placeholder={`e.g., ${nfa.alphabet.join('')}${nfa.alphabet[0] || ''}`}
                />
                <Button onClick={startSimulation}>Restart</Button>
              </InputContainer>
              
              <CurrentInput>
                {simulationState.processedInput.split('').map((char, index) => (
                  <span key={`p-${index}`} className="processed">{char}</span>
                ))}
                
                {simulationState.remainingInput.length > 0 ? (
                  <>
                    <span key="c-current" className="current">{simulationState.remainingInput[0]}</span>
                    
                    {simulationState.remainingInput.slice(1).split('').map((char, index) => (
                      <span key={`r-${index}`} className="remaining">{char}</span>
                    ))}
                  </>
                ) : null}
              </CurrentInput>
              
              <StepInfo>
                <InfoIcon>i</InfoIcon>
                Current States: 
                {simulationState.currentStates.length > 0 ? (
                  simulationState.currentStates.map((state, index) => (
                    <SymbolBadge key={state}>
                      {state}
                    </SymbolBadge>
                  ))
                ) : (
                  <SymbolBadge>None (Rejected)</SymbolBadge>
                )}
                
                {simulationState.isComplete && (
                  <div style={{ marginTop: '10px' }}>
                    Final Result: {simulationState.currentStates.some(s => nfa.acceptingStates.includes(s)) ? 
                      'Accepted ✓' : 'Rejected ✗'}
                  </div>
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

export default NFAEditor;