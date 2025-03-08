# Automata Editor Refactoring Plan

## Current Issues
1. DFA and NFA editors have significant code duplication
2. Each editor file is too large (~500-600 lines)
3. Rendering logic is mixed with form handling
4. Simulation state management is complex and tightly coupled
5. No reuse between DFA and NFA components despite similar functionality

## Proposed Architecture

### 1. Common Components
Create reusable components for shared UI elements:

#### EditorLayout
- Container for all editor components
- Tab handling
- General layout structure

#### StateManager
- Custom hook or context for automaton state management
- Single state source of truth
- Separate DFA and NFA-specific logic

#### AutomataForm
- Generic form component for defining automata
- Configurable fields based on automaton type
- Props-based rendering for specialized UI elements

#### AutomataVisualization
- Focus on visualization only, no state management
- Consumes automaton model and visualization settings
- Handles canvas rendering

#### SimulationPanel
- Simulation controls and visualizations
- Consumes simulation state from simulation hook

### 2. File Structure
```
/src
  /components
    /automata
      /common
        AutomataForm.js
        EditorLayout.js
        SimulationPanel.js
      /dfa
        DFAForm.js
        DFATransitions.js
      /nfa
        NFAForm.js
        NFATransitions.js
  /hooks
    /automata
      useAutomatonState.js
      useSimulation.js (refactored)
  /context
    /automata
      AutomataContext.js
  /utils
    /automata
      AutomatonModel.js (unchanged)
      CanvasManager.js (optimized)
  /pages
    /automata
      DFAEditor.js (reduced)
      NFAEditor.js (reduced)
```

### 3. State Management

#### Option A: Custom Hooks
```javascript
// In DFAEditor.js
const { 
  automaton, 
  updateStates, 
  updateAlphabet,
  setInitialState,
  setAcceptingStates,
  updateTransition 
} = useAutomatonState('dfa', initialConfig);

// In NFAEditor.js
const { 
  automaton, 
  updateStates, 
  updateAlphabet,
  setInitialState,
  setAcceptingStates,
  updateTransition,
  toggleEpsilonTransitions
} = useAutomatonState('nfa', initialConfig);
```

#### Option B: Context API
```javascript
// Wrap in provider in parent component
<AutomataContextProvider type="dfa">
  <DFAEditor />
</AutomataContextProvider>

// Inside component
const { automaton, dispatch } = useAutomataContext();
// Use dispatch to update state
dispatch({ type: 'UPDATE_STATES', payload: newStates });
```

### 4. Implementation Strategy

#### Phase 1: Extract Common Components
1. Create EditorLayout component with tabs
2. Extract AutomataForm component for form fields
3. Extract SimulationPanel component 

#### Phase 2: State Management Refactoring
1. Implement useAutomatonState hook
2. Update DFA/NFA editors to use the hook
3. Refactor useSimulation hook to better separate concerns

#### Phase 3: Visualization Improvement
1. Optimize canvas rendering
2. Extract visualization-specific code
3. Improve performance with React.memo and optimized rendering

## Benefits
1. Reduced code duplication (estimated 40-50% reduction)
2. Better separation of concerns
3. Easier maintenance and feature additions
4. Improved performance through optimized rendering
5. More consistent UI between DFA and NFA editors