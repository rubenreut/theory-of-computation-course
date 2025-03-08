import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

// Import common components
import EditorLayout from '../../components/automata/common/EditorLayout';
import AutomataForm, { TestResult, TestInputContainer, Label, InputContainer, TestInput, Button } from '../../components/automata/common/AutomataForm';
import AutomataVisualization from '../../components/automata/common/AutomataVisualization';
import SimulationControls from '../../components/automata/SimulationControls';

// Import NFA-specific components
import NFATransitions from '../../components/automata/nfa/NFATransitions';

// Import hooks and models
import useAutomatonState from '../../hooks/automata/useAutomatonState';
import useSimulation from '../../hooks/useSimulation';
import { NFAModel } from '../../utils/automata/AutomatonModel';

// Additional styled components
const SimulationContainer = styled.div`
  margin-top: var(--spacing-xl);
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-right: var(--spacing-md);
  font-weight: 500;
  user-select: none;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--tertiary-color);
  }
`;

/**
 * NFAEditor component
 * 
 * Editor and simulator for Non-deterministic Finite Automata (NFA).
 */
const NFAEditor = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('definition');
  
  // Initialize with default NFA
  const initialNFA = {
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
  };
  
  // Use custom hook for NFA state management
  const {
    automaton: nfa,
    updateStates,
    updateAlphabet,
    setInitialState,
    setAcceptingStates,
    updateTransition,
    showEpsilonTransitions,
    toggleEpsilonTransitions
  } = useAutomatonState('nfa', initialNFA);
  
  // Define tabs
  const tabs = [
    { id: 'definition', label: 'Definition' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'simulation', label: 'Simulation', disabled: !nfa || !nfa.alphabet || nfa.alphabet.length === 0 }
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
  
  const handleTransitionChange = (fromState, symbol, toState, options) => {
    updateTransition(fromState, symbol, toState, options);
  };
  
  // ===== SIMULATION INTEGRATION =====
  // NFA-specific simulation functions
  const computeNextStates = useCallback((currentStates, symbol) => {
    return nfa.computeNextStates(currentStates, symbol);
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
    handleTestInput
  } = useSimulation({
    initialState: nfa.initialState,
    initialStates: nfa.computeEpsilonClosure([nfa.initialState]),
    type: 'nfa',
    computeNextStates,
    areAcceptingStates,
    computeEpsilonClosure,
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
  
  // Epsilon transition toggle control component
  const EpsilonControl = () => (
    <CheckboxLabel variant="nfa">
      <input 
        type="checkbox"
        checked={showEpsilonTransitions}
        onChange={toggleEpsilonTransitions}
      />
      Show ε-transitions
    </CheckboxLabel>
  );
  
  // ===== RENDER COMPONENTS =====
  // 1. Definition content
  const definitionContent = (
    <AutomataForm
      variant="nfa"
      automaton={nfa}
      onStatesChange={handleStatesChange}
      onAlphabetChange={handleAlphabetChange}
      onInitialStateChange={handleInitialStateChange}
      onAcceptingStatesChange={handleAcceptingStatesChange}
      testInput={testInput}
      onTestInputChange={setTestInput}
      onTestSubmit={handleTestSubmit}
      testResult={testResult}
      additionalControls={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Label>Transition Function (check all applicable transitions):</Label>
          <EpsilonControl />
        </div>
      }
      transitionsComponent={
        <NFATransitions 
          automaton={nfa}
          onTransitionChange={handleTransitionChange}
          showEpsilonTransitions={showEpsilonTransitions}
        />
      }
    />
  );
  
  // 2. Visualization content
  const visualizationContent = (
    <AutomataVisualization
      title="NFA Visualization"
      variant="nfa"
      automaton={nfa}
      simulationState={simulationState}
      headerControls={<EpsilonControl />}
    >
      <TestInputContainer>
        <Label htmlFor="testInputVis">Test Input String:</Label>
        <InputContainer>
          <TestInput 
            type="text" 
            id="testInputVis" 
            value={testInput} 
            onChange={setTestInput} 
            placeholder={`e.g., ${nfa.alphabet.join('')}${nfa.alphabet[0] || ''}`}
            variant="nfa"
          />
          <Button 
            onClick={handleTestSubmit}
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
    </AutomataVisualization>
  );
  
  // 3. Simulation content
  const simulationContent = (
    <AutomataVisualization
      title="NFA Simulation"
      variant="nfa"
      automaton={nfa}
      simulationState={simulationState}
      isLoading={isLoading}
      loadingMessage="Setting up simulation..."
      headerControls={
        <CheckboxLabel variant="nfa">
          <input 
            type="checkbox"
            checked={showEpsilonTransitions}
            onChange={toggleEpsilonTransitions}
          />
          Include ε-transitions
        </CheckboxLabel>
      }
    >
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
    </AutomataVisualization>
  );
  
  // ===== MAIN RENDER =====
  return (
    <EditorLayout
      title="Non-deterministic Finite Automaton (NFA)"
      description="An NFA is a finite-state machine where for some state and input symbol, the next state may be multiple possible states or none at all. Unlike DFAs, NFAs can transition to multiple states for the same input symbol."
      variant="nfa"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      definitionContent={definitionContent}
      visualizationContent={visualizationContent}
      simulationContent={simulationContent}
    />
  );
};

export default NFAEditor;