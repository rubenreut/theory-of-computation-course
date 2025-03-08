import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

// Import common components
import EditorLayout from '../../components/automata/common/EditorLayout';
import AutomataForm, { TestResult, TestInputContainer, Label, InputContainer, TestInput, Button } from '../../components/automata/common/AutomataForm';
import AutomataVisualization from '../../components/automata/common/AutomataVisualization';
import SimulationControls from '../../components/automata/SimulationControls';

// Import DFA-specific components
import DFATransitions from '../../components/automata/dfa/DFATransitions';

// Import hooks and models
import useAutomatonState from '../../hooks/automata/useAutomatonState';
import useSimulation from '../../hooks/useSimulation';
// DFA model is imported through useAutomatonState hook

// Additional styled components
const SimulationContainer = styled.div`
  margin-top: var(--spacing-xl);
`;

/**
 * DFAEditor component
 * 
 * Editor and simulator for Deterministic Finite Automata (DFA).
 */
const DFAEditor = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('definition');
  
  // Initialize with default DFA
  const initialDFA = {
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    transitions: {
      q0: { '0': 'q0', '1': 'q1' },
      q1: { '0': 'q2', '1': 'q0' },
      q2: { '0': 'q1', '1': 'q2' }
    },
    initialState: 'q0',
    acceptingStates: ['q2']
  };
  
  // Use custom hook for DFA state management
  const {
    automaton: dfa,
    updateStates,
    updateAlphabet,
    setInitialState,
    setAcceptingStates,
    updateTransition
  } = useAutomatonState('dfa', initialDFA);
  
  // Define tabs
  const tabs = [
    { id: 'definition', label: 'Definition' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'simulation', label: 'Simulation', disabled: !dfa || !dfa.alphabet || dfa.alphabet.length === 0 }
  ];
  
  // ===== FORM HANDLERS =====
  const handleStatesChange = (e) => {
    updateStates(e.target.value);
  };
  
  const handleAlphabetChange = (e) => {
    updateAlphabet(e.target.value);
  };
  
  const handleInitialStateChange = (e) => {
    setInitialState(e.target.value);
  };
  
  const handleAcceptingStatesChange = (e) => {
    setAcceptingStates(e.target.value);
  };
  
  const handleTransitionChange = (fromState, symbol, toState) => {
    updateTransition(fromState, symbol, toState);
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
    handleTestInput
  } = useSimulation({
    initialState: dfa.initialState,
    type: 'dfa',
    computeNextState,
    isAcceptingState,
    defaultSpeed: 200
  });
  
  // Test submission handler that changes to simulation tab
  const handleTestSubmit = () => {
    if (handleTestInput()) {
      setActiveTab('simulation');
      return true;
    }
    return false;
  };
  
  // ===== RENDER COMPONENTS =====
  // 1. Definition content
  const definitionContent = (
    <AutomataForm
      variant="dfa"
      automaton={dfa}
      onStatesChange={handleStatesChange}
      onAlphabetChange={handleAlphabetChange}
      onInitialStateChange={handleInitialStateChange}
      onAcceptingStatesChange={handleAcceptingStatesChange}
      testInput={testInput}
      onTestInputChange={setTestInput}
      onTestSubmit={handleTestSubmit}
      testResult={testResult}
      transitionsComponent={
        <DFATransitions 
          automaton={dfa}
          onTransitionChange={handleTransitionChange}
        />
      }
    />
  );
  
  // 2. Visualization content
  const visualizationContent = (
    <AutomataVisualization
      title="DFA Visualization"
      variant="dfa"
      automaton={dfa}
      simulationState={simulationState}
    >
      <TestInputContainer>
        <Label htmlFor="testInputVis">Test Input String:</Label>
        <InputContainer>
          <TestInput 
            type="text" 
            id="testInputVis" 
            value={testInput} 
            onChange={setTestInput} 
            placeholder={`e.g., ${dfa.alphabet.join('')}${dfa.alphabet[0] || ''}`}
          />
          <Button onClick={handleTestSubmit}>
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
    </AutomataVisualization>
  );
  
  // 3. Simulation content
  const simulationContent = (
    <AutomataVisualization
      title="DFA Simulation"
      variant="dfa"
      automaton={dfa}
      simulationState={simulationState}
      isLoading={isLoading}
      loadingMessage="Setting up simulation..."
    >
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
    </AutomataVisualization>
  );
  
  // ===== MAIN RENDER =====
  return (
    <EditorLayout
      title="Deterministic Finite Automaton (DFA)"
      description="A DFA is a finite state machine that accepts or rejects strings of symbols. It can be in exactly one state at a time, and transitions to another state based on the current state and the input symbol."
      variant="dfa"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      definitionContent={definitionContent}
      visualizationContent={visualizationContent}
      simulationContent={simulationContent}
    />
  );
};

export default DFAEditor;