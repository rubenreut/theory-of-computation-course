import { useState, useCallback, useMemo } from 'react';
import { DFAModel, NFAModel } from '../../utils/automata/AutomatonModel';

/**
 * Custom hook for managing automaton state (DFA or NFA)
 * 
 * Provides a unified interface for managing both DFA and NFA state
 * while handling the differences between them.
 * 
 * @param {string} type The type of automaton ('dfa' or 'nfa')
 * @param {Object} initialConfig Initial configuration for the automaton
 * @returns {Object} State and methods for managing the automaton
 */
const useAutomatonState = (type = 'dfa', initialConfig = {}) => {
  // Create the appropriate model based on type
  const createModel = useCallback((config) => {
    return type === 'dfa' 
      ? new DFAModel(config)
      : new NFAModel(config);
  }, [type]);

  // Initialize state with the appropriate model
  const [automaton, setAutomaton] = useState(() => createModel(initialConfig));
  
  // For NFA: track epsilon transitions visibility separately from model
  const [showEpsilonTransitions, setShowEpsilonTransitions] = useState(
    type === 'nfa' ? (initialConfig.useEpsilonTransitions !== false) : false
  );

  // Get a safe copy of the current state to use in updates
  const getStateCopy = useCallback(() => {
    return automaton.toJSON();
  }, [automaton]);

  // Update the list of states
  const updateStates = useCallback((statesInput) => {
    // Handle string or array input
    const statesList = Array.isArray(statesInput) 
      ? statesInput 
      : statesInput.split(',').map(s => s.trim()).filter(s => s);
    
    const newAutomaton = createModel({
      ...getStateCopy(),
      states: statesList
    });
    
    setAutomaton(newAutomaton);
    return newAutomaton;
  }, [createModel, getStateCopy]);

  // Update the alphabet
  const updateAlphabet = useCallback((alphabetInput) => {
    // Handle string or array input
    const alphabetList = Array.isArray(alphabetInput) 
      ? alphabetInput 
      : alphabetInput.split(',').map(a => a.trim()).filter(a => a);
    
    const newAutomaton = createModel({
      ...getStateCopy(),
      alphabet: alphabetList
    });
    
    setAutomaton(newAutomaton);
    return newAutomaton;
  }, [createModel, getStateCopy]);

  // Set the initial state
  const setInitialState = useCallback((state) => {
    const newAutomaton = createModel({
      ...getStateCopy(),
      initialState: state
    });
    
    setAutomaton(newAutomaton);
    return newAutomaton;
  }, [createModel, getStateCopy]);

  // Update accepting states
  const setAcceptingStates = useCallback((statesInput) => {
    // Handle string or array input
    const statesList = Array.isArray(statesInput) 
      ? statesInput 
      : statesInput.split(',').map(s => s.trim()).filter(s => s);
    
    const newAutomaton = createModel({
      ...getStateCopy(),
      acceptingStates: statesList
    });
    
    setAutomaton(newAutomaton);
    return newAutomaton;
  }, [createModel, getStateCopy]);

  // Update transitions - implementation differs between DFA and NFA
  const updateTransition = useCallback((fromState, symbol, toState, options = {}) => {
    const transitions = JSON.parse(JSON.stringify(automaton.transitions));
    
    if (type === 'dfa') {
      // For DFA: simple assignment
      transitions[fromState][symbol] = toState;
    } else {
      // For NFA: array management with add/remove
      const { action = 'toggle' } = options;
      const currentTransitions = transitions[fromState][symbol] || [];
      
      if (action === 'add' || (action === 'toggle' && !currentTransitions.includes(toState))) {
        // Add transition
        if (!currentTransitions.includes(toState)) {
          transitions[fromState][symbol] = [...currentTransitions, toState];
        }
      } else if (action === 'remove' || (action === 'toggle' && currentTransitions.includes(toState))) {
        // Remove transition
        const index = currentTransitions.indexOf(toState);
        if (index !== -1) {
          const newTransitions = [...currentTransitions];
          newTransitions.splice(index, 1);
          transitions[fromState][symbol] = newTransitions;
        }
      }
    }
    
    const newAutomaton = createModel({
      ...getStateCopy(),
      transitions
    });
    
    setAutomaton(newAutomaton);
    return newAutomaton;
  }, [automaton, createModel, getStateCopy, type]);

  // NFA-specific: toggle epsilon transitions
  const toggleEpsilonTransitions = useCallback(() => {
    if (type !== 'nfa') return null;
    
    const newShowEpsilon = !showEpsilonTransitions;
    setShowEpsilonTransitions(newShowEpsilon);
    
    const newAutomaton = createModel({
      ...getStateCopy(),
      useEpsilonTransitions: newShowEpsilon
    });
    
    setAutomaton(newAutomaton);
    return newAutomaton;
  }, [type, showEpsilonTransitions, createModel, getStateCopy]);

  // Return values based on automaton type
  const returnValues = useMemo(() => {
    const common = {
      automaton,
      updateStates,
      updateAlphabet,
      setInitialState,
      setAcceptingStates,
      updateTransition,
      reset: (config) => setAutomaton(createModel(config))
    };
    
    if (type === 'nfa') {
      return {
        ...common,
        showEpsilonTransitions,
        toggleEpsilonTransitions
      };
    }
    
    return common;
  }, [
    automaton, 
    type, 
    updateStates, 
    updateAlphabet, 
    setInitialState, 
    setAcceptingStates, 
    updateTransition, 
    createModel,
    showEpsilonTransitions,
    toggleEpsilonTransitions
  ]);

  return returnValues;
};

export default useAutomatonState;