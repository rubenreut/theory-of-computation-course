import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for simulating automata (DFA/NFA)
 * 
 * Handles:
 * - State management for simulation
 * - Starting, pausing, resuming, stopping
 * - Step-by-step execution
 * - Animation timing and control
 */
const useSimulation = (options = {}) => {
  const {
    initialState = '',
    initialStates = [], // For NFA
    type = 'dfa', // 'dfa' or 'nfa'
    computeNextState = null,
    computeNextStates = null, // For NFA
    computeEpsilonClosure = null, // For NFA with epsilon transitions
    isAcceptingState = null,
    areAcceptingStates = null, // For NFA
    renderCallback = null,
    defaultSpeed = 500
  } = options;

  // Animation reference for cleanup
  const animationRef = useRef(null);
  
  // Simulation state
  const [simulationState, setSimulationState] = useState({
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    currentState: type === 'dfa' ? initialState : null,
    currentStates: type === 'nfa' ? initialStates : null,
    processedInput: '',
    remainingInput: '',
    speed: defaultSpeed,
    isComplete: false,
    path: []
  });

  // Test results
  const [testResult, setTestResult] = useState({ 
    visible: false, 
    accepted: false, 
    message: '' 
  });
  
  // Loading state for animations
  const [isLoading, setIsLoading] = useState(false);
  
  // For handling input string
  const [testInput, setTestInput] = useState('');

  // Start simulation
  const startSimulation = useCallback(() => {
    // Reset previous simulation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    // Show loading while preparing animation
    setIsLoading(true);
    
    // Use requestAnimationFrame to ensure UI updates before starting simulation
    requestAnimationFrame(() => {
      if (type === 'dfa') {
        // Set up initial DFA simulation state
        setSimulationState({
          isRunning: true,
          isPaused: false,
          currentStep: 0,
          currentState: initialState,
          currentStates: null,
          processedInput: '',
          remainingInput: testInput,
          speed: simulationState.speed,
          isComplete: false,
          path: [{ state: initialState, input: '' }]
        });
      } else {
        // Apply epsilon closure to initial state for NFA
        const initialStatesWithClosure = computeEpsilonClosure 
          ? computeEpsilonClosure([initialState]) 
          : initialStates;
          
        // Set up initial NFA simulation state
        setSimulationState({
          isRunning: true,
          isPaused: false,
          currentStep: 0,
          currentState: null,
          currentStates: initialStatesWithClosure,
          processedInput: '',
          remainingInput: testInput,
          speed: simulationState.speed,
          isComplete: false,
          path: [{ 
            states: initialStatesWithClosure, 
            input: '', 
            epsilonTransitions: initialStatesWithClosure.length > 1
          }]
        });
      }
      
      // Hide loading indicator after setup is complete
      setTimeout(() => {
        setIsLoading(false);
        
        // Trigger a render if callback provided
        if (renderCallback) {
          requestAnimationFrame(renderCallback);
        }
      }, 500);
    });
  }, [
    type, 
    initialState, 
    initialStates, 
    computeEpsilonClosure,
    testInput, 
    renderCallback,
    simulationState.speed
  ]);
  
  // Pause simulation
  const pauseSimulation = useCallback(() => {
    setSimulationState(prevState => ({
      ...prevState,
      isPaused: true
    }));
    
    // Clear any pending animation frame
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, []);
  
  // Resume simulation
  const resumeSimulation = useCallback(() => {
    setSimulationState(prevState => ({
      ...prevState,
      isPaused: false
    }));
    
    // Continue simulation
    runSimulationStep();
  }, []);
  
  // Stop simulation - complete reset of state
  const stopSimulation = useCallback(() => {
    // Clear any pending animation frame
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    if (type === 'dfa') {
      // Reset to initial DFA state
      setSimulationState({
        isRunning: false,
        isPaused: false,
        currentStep: 0,
        currentState: initialState,
        currentStates: null,
        processedInput: '',
        remainingInput: testInput,
        speed: simulationState.speed, // maintain current speed setting
        isComplete: false,
        path: []
      });
    } else {
      // Apply epsilon closure to initial state for NFA
      const initialStatesWithClosure = computeEpsilonClosure 
        ? computeEpsilonClosure([initialState]) 
        : initialStates;
        
      // Reset to initial NFA state
      setSimulationState({
        isRunning: false,
        isPaused: false,
        currentStep: 0,
        currentState: null,
        currentStates: initialStatesWithClosure,
        processedInput: '',
        remainingInput: testInput,
        speed: simulationState.speed, // maintain current speed setting
        isComplete: false,
        path: []
      });
    }
    
    setTestResult({ visible: false, accepted: false });
    
    // Redraw visualization if callback provided
    if (renderCallback) {
      setTimeout(renderCallback, 50);
    }
  }, [
    type, 
    initialState, 
    initialStates, 
    computeEpsilonClosure, 
    testInput, 
    renderCallback,
    simulationState.speed
  ]);
  
  // Run a single step of the simulation - DFA version
  const runDFAStep = useCallback(() => {
    if (!computeNextState) return;
    
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
        const accepted = isAcceptingState(currentState);
        
        // Set test result
        setTestResult({
          visible: true,
          accepted,
          message: accepted 
            ? `Success! Input "${testInput}" is accepted.` 
            : `Rejected! Input "${testInput}" ends in state ${currentState}, which is not an accepting state.`
        });
        
        return {
          ...prevState,
          isComplete: true
        };
      }
      
      // Process next character
      const nextChar = remainingInput[0];
      
      // Find next state
      const result = computeNextState(currentState, nextChar);
      
      // Handle invalid transitions
      if (result.error) {
        setTestResult({
          visible: true,
          accepted: false,
          message: result.error
        });
        
        return {
          ...prevState,
          isComplete: true
        };
      }
      
      const nextState = result.nextState;
      
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
          // Trigger next step via requestAnimationFrame to avoid immediate recursion
          requestAnimationFrame(() => {
            runSimulationStep();
          });
          
          // Also trigger render callback if provided
          if (renderCallback) {
            requestAnimationFrame(renderCallback);
          }
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
  }, [
    computeNextState, 
    isAcceptingState, 
    testInput, 
    renderCallback
  ]);
  
  // Run a single step of the simulation - NFA version
  const runNFAStep = useCallback(() => {
    if (!computeNextStates) return;
    
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
        const accepted = areAcceptingStates(currentStates);
        
        // Set test result
        setTestResult({
          visible: true,
          accepted,
          message: accepted 
            ? `Success! Input "${testInput}" is accepted.` 
            : `Rejected! Input "${testInput}" ends in states [${currentStates.join(', ')}], none of which are accepting states.`
        });
        
        return {
          ...prevState,
          isComplete: true
        };
      }
      
      // Process next character
      const nextChar = remainingInput[0];
      
      // Find next states
      const result = computeNextStates(currentStates, nextChar);
      
      // Handle invalid transitions
      if (result.error) {
        setTestResult({
          visible: true,
          accepted: false,
          message: result.error
        });
        
        return {
          ...prevState,
          isComplete: true
        };
      }
      
      // If no valid transitions, reject
      if (result.nextStates.length === 0) {
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
        states: result.nextStates, 
        input: nextChar, 
        fromStates: currentStates,
        processedInput: processedInput + nextChar,
        remainingInput: remainingInput.slice(1),
        transitions: result.transitions,
        epsilonTransitions: result.epsilonTransitions || false,
        epsilonDetails: result.epsilonDetails || []
      }];
      
      // Schedule next step with proper animation timing
      if (!prevState.isPaused && !prevState.isComplete) {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
        
        animationRef.current = setTimeout(() => {
          // Trigger next step via requestAnimationFrame to avoid immediate recursion
          requestAnimationFrame(() => {
            runSimulationStep();
          });
          
          // Also trigger render callback if provided
          if (renderCallback) {
            requestAnimationFrame(renderCallback);
          }
        }, prevState.speed);
      }
      
      return {
        ...prevState,
        currentStep: prevState.currentStep + 1,
        currentStates: result.nextStates,
        processedInput: processedInput + nextChar,
        remainingInput: remainingInput.slice(1),
        path: newPath
      };
    });
  }, [
    computeNextStates, 
    areAcceptingStates, 
    testInput, 
    renderCallback
  ]);
  
  // Choose appropriate simulation step based on type
  const runSimulationStep = useCallback(() => {
    if (type === 'dfa') {
      runDFAStep();
    } else {
      runNFAStep();
    }
  }, [type, runDFAStep, runNFAStep]);
  
  // Handle step forward with forced rendering
  const handleStepForward = useCallback(() => {
    if (simulationState.isComplete) return;
    
    if (!simulationState.isRunning) {
      startSimulation();
      return;
    }
    
    if (simulationState.isPaused) {
      // Run one step and then force redraw immediately
      runSimulationStep();
      if (renderCallback) {
        setTimeout(renderCallback, 10);
      }
    }
  }, [
    simulationState.isComplete,
    simulationState.isRunning,
    simulationState.isPaused,
    startSimulation,
    runSimulationStep,
    renderCallback
  ]);
  
  // Handle step backward with forced rendering
  const handleStepBackward = useCallback(() => {
    setSimulationState(prevState => {
      if (prevState.currentStep <= 0 || !prevState.isRunning) {
        return prevState;
      }
      
      const newPath = [...prevState.path];
      newPath.pop();
      const previousStep = newPath[newPath.length - 1];
      
      // Schedule an immediate redraw after state update
      if (renderCallback) {
        setTimeout(renderCallback, 10);
      }
      
      // Different handling for DFA vs NFA
      if (type === 'dfa') {
        return {
          ...prevState,
          currentStep: prevState.currentStep - 1,
          currentState: previousStep.state,
          currentStates: null,
          processedInput: previousStep.processedInput || '',
          remainingInput: testInput.slice(previousStep.processedInput ? previousStep.processedInput.length : 0),
          isComplete: false,
          path: newPath
        };
      } else {
        return {
          ...prevState,
          currentStep: prevState.currentStep - 1,
          currentState: null,
          currentStates: previousStep.states,
          processedInput: previousStep.processedInput || '',
          remainingInput: testInput.slice(previousStep.processedInput ? previousStep.processedInput.length : 0),
          isComplete: false,
          path: newPath
        };
      }
    });
    
    // Clear test result
    setTestResult({ visible: false, accepted: false });
  }, [type, testInput, renderCallback]);
  
  // Handle speed change
  const handleSpeedChange = useCallback((e) => {
    setSimulationState(prevState => ({
      ...prevState,
      speed: parseInt(e.target.value)
    }));
  }, []);
  
  // Handle test input change
  const handleTestInputChange = useCallback((e) => {
    setTestInput(e.target.value);
  }, []);
  
  // Handle test input submit
  const handleTestInput = useCallback(() => {
    if (!testInput) {
      setTestResult({
        visible: true,
        accepted: false,
        message: "Please enter an input string to test."
      });
      return;
    }
    
    // Start simulation with the current input
    startSimulation();
    
    return true;
  }, [testInput, startSimulation]);
  
  // Cleanup effect
  const cleanup = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  return {
    simulationState,
    testResult,
    isLoading,
    testInput,
    setTestInput: handleTestInputChange,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
    handleStepForward,
    handleStepBackward,
    handleSpeedChange,
    handleTestInput,
    cleanup
  };
};

export default useSimulation;