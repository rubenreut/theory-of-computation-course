/**
 * Base Automaton Model
 * 
 * Abstract base class for DFA and NFA models
 */
export class AutomatonModel {
  constructor(config = {}) {
    this.states = config.states || [];
    this.alphabet = config.alphabet || [];
    this.initialState = config.initialState || '';
    this.acceptingStates = config.acceptingStates || [];
    this.transitions = config.transitions || {};
    this.type = 'automaton';
  }

  // Add a state to the automaton
  addState(state) {
    if (!this.states.includes(state)) {
      this.states.push(state);
      this.transitions[state] = {};
      this.alphabet.forEach(symbol => {
        this.transitions[state][symbol] = this.getDefaultTransitionValue();
      });
    }
    return this.states;
  }

  // Remove a state from the automaton
  removeState(state) {
    const index = this.states.indexOf(state);
    if (index !== -1) {
      this.states.splice(index, 1);
      delete this.transitions[state];
      
      // Remove transitions to this state
      Object.keys(this.transitions).forEach(fromState => {
        Object.keys(this.transitions[fromState]).forEach(symbol => {
          this.removeTransitionToState(fromState, symbol, state);
        });
      });
      
      // If removed state was initial, reset initial state
      if (this.initialState === state && this.states.length > 0) {
        this.initialState = this.states[0];
      }
      
      // Remove from accepting states
      const acceptingIndex = this.acceptingStates.indexOf(state);
      if (acceptingIndex !== -1) {
        this.acceptingStates.splice(acceptingIndex, 1);
      }
    }
    return this.states;
  }

  // Add a symbol to the alphabet
  addSymbol(symbol) {
    if (!this.alphabet.includes(symbol)) {
      this.alphabet.push(symbol);
      
      // Add empty transitions for this symbol to all states
      this.states.forEach(state => {
        this.transitions[state][symbol] = this.getDefaultTransitionValue();
      });
    }
    return this.alphabet;
  }

  // Remove a symbol from the alphabet
  removeSymbol(symbol) {
    const index = this.alphabet.indexOf(symbol);
    if (index !== -1) {
      this.alphabet.splice(index, 1);
      
      // Remove transitions using this symbol
      this.states.forEach(state => {
        delete this.transitions[state][symbol];
      });
    }
    return this.alphabet;
  }

  // Set initial state
  setInitialState(state) {
    if (this.states.includes(state)) {
      this.initialState = state;
    }
    return this.initialState;
  }

  // Toggle accepting state status
  toggleAcceptingState(state) {
    const index = this.acceptingStates.indexOf(state);
    if (index === -1 && this.states.includes(state)) {
      this.acceptingStates.push(state);
    } else if (index !== -1) {
      this.acceptingStates.splice(index, 1);
    }
    return this.acceptingStates;
  }

  // Check if a state is accepting
  isAcceptingState(state) {
    return this.acceptingStates.includes(state);
  }

  // Must be implemented by subclasses
  getDefaultTransitionValue() {
    throw new Error('Method must be implemented by subclass');
  }

  // Must be implemented by subclasses
  removeTransitionToState(fromState, symbol, toState) {
    throw new Error('Method must be implemented by subclass');
  }

  // Must be implemented by subclasses
  processInput(input) {
    throw new Error('Method must be implemented by subclass');
  }

  // Serialize to JSON-compatible object
  toJSON() {
    return {
      type: this.type,
      states: [...this.states],
      alphabet: [...this.alphabet],
      transitions: JSON.parse(JSON.stringify(this.transitions)),
      initialState: this.initialState,
      acceptingStates: [...this.acceptingStates]
    };
  }

  // Create from JSON object
  static fromJSON(json) {
    throw new Error('Method must be implemented by subclass');
  }
}

/**
 * DFA Model
 * 
 * Implementation of Deterministic Finite Automaton
 */
export class DFAModel extends AutomatonModel {
  constructor(config = {}) {
    super(config);
    this.type = 'dfa';
    
    // Initialize any missing transitions with default values
    this.states.forEach(state => {
      if (!this.transitions[state]) {
        this.transitions[state] = {};
      }
      
      this.alphabet.forEach(symbol => {
        if (!this.transitions[state][symbol]) {
          this.transitions[state][symbol] = this.states[0] || state;
        }
      });
    });
  }

  // Set a transition
  setTransition(fromState, symbol, toState) {
    if (this.states.includes(fromState) && 
        this.states.includes(toState) && 
        this.alphabet.includes(symbol)) {
      this.transitions[fromState][symbol] = toState;
    }
    return this.transitions;
  }

  // Get default transition value for a DFA
  getDefaultTransitionValue() {
    return this.states[0] || '';
  }

  // For DFA, just update the transition
  removeTransitionToState(fromState, symbol, toState) {
    if (this.transitions[fromState] && 
        this.transitions[fromState][symbol] === toState) {
      this.transitions[fromState][symbol] = this.getDefaultTransitionValue();
    }
  }

  // Process an input string
  processInput(input) {
    let currentState = this.initialState;
    let accepted = false;
    
    for (let i = 0; i < input.length; i++) {
      const symbol = input[i];
      
      // Check if symbol is in alphabet
      if (!this.alphabet.includes(symbol)) {
        return {
          accepted: false,
          error: `Symbol '${symbol}' not in alphabet`
        };
      }
      
      // Transition to next state
      currentState = this.transitions[currentState][symbol];
    }
    
    // Check if final state is accepting
    accepted = this.acceptingStates.includes(currentState);
    
    return { accepted, finalState: currentState };
  }

  // Compute next state for a single step (used by simulation)
  computeNextState(currentState, symbol) {
    // Validate symbol
    if (!this.alphabet.includes(symbol)) {
      return {
        error: `Error: Character '${symbol}' is not in the alphabet.`,
        nextState: null
      };
    }
    
    // Find next state
    const nextState = this.transitions[currentState][symbol];
    
    return { nextState };
  }

  // Static method to create from JSON
  static fromJSON(json) {
    if (json.type !== 'dfa') {
      throw new Error('Invalid JSON type for DFA');
    }
    return new DFAModel(json);
  }
}

/**
 * NFA Model
 * 
 * Implementation of Non-deterministic Finite Automaton
 * with optional epsilon transitions
 */
export class NFAModel extends AutomatonModel {
  constructor(config = {}) {
    super(config);
    this.type = 'nfa';
    this.epsilonSymbol = config.epsilonSymbol || 'ε';
    this.useEpsilonTransitions = config.useEpsilonTransitions !== false;
    
    // Initialize any missing transitions with default values
    this.states.forEach(state => {
      if (!this.transitions[state]) {
        this.transitions[state] = {};
      }
      
      this.alphabet.forEach(symbol => {
        if (!this.transitions[state][symbol]) {
          this.transitions[state][symbol] = [];
        }
      });
      
      // Add epsilon transitions if enabled
      if (this.useEpsilonTransitions && !this.transitions[state][this.epsilonSymbol]) {
        this.transitions[state][this.epsilonSymbol] = [];
      }
    });
  }

  // Set/add a transition
  addTransition(fromState, symbol, toState) {
    if (this.states.includes(fromState) && 
        this.states.includes(toState) && 
        (this.alphabet.includes(symbol) || 
        (this.useEpsilonTransitions && symbol === this.epsilonSymbol))) {
          
      if (!this.transitions[fromState][symbol]) {
        this.transitions[fromState][symbol] = [];
      }
      
      if (!this.transitions[fromState][symbol].includes(toState)) {
        this.transitions[fromState][symbol].push(toState);
      }
    }
    return this.transitions;
  }

  // Remove a specific transition
  removeTransition(fromState, symbol, toState) {
    if (this.transitions[fromState] && 
        this.transitions[fromState][symbol]) {
      const index = this.transitions[fromState][symbol].indexOf(toState);
      if (index !== -1) {
        this.transitions[fromState][symbol].splice(index, 1);
      }
    }
    return this.transitions;
  }

  // Get default transition value for an NFA
  getDefaultTransitionValue() {
    return [];
  }

  // For NFA, remove toState from the array of transitions
  removeTransitionToState(fromState, symbol, toState) {
    if (this.transitions[fromState] && 
        this.transitions[fromState][symbol] && 
        Array.isArray(this.transitions[fromState][symbol])) {
      const index = this.transitions[fromState][symbol].indexOf(toState);
      if (index !== -1) {
        this.transitions[fromState][symbol].splice(index, 1);
      }
    }
  }

  // Compute epsilon closure for a set of states
  computeEpsilonClosure(states) {
    if (!this.useEpsilonTransitions) return [...states];
    
    const closure = [...states];
    const stack = [...states];
    
    while (stack.length > 0) {
      const state = stack.pop();
      const epsilonTransitions = this.transitions[state][this.epsilonSymbol];
      
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
  }

  // Process an input string
  processInput(input) {
    // Start with initial state and apply epsilon closure
    let currentStates = this.computeEpsilonClosure([this.initialState]);
    
    for (let i = 0; i < input.length; i++) {
      const symbol = input[i];
      
      // Check if symbol is in alphabet
      if (!this.alphabet.includes(symbol)) {
        return {
          accepted: false,
          error: `Symbol '${symbol}' not in alphabet`
        };
      }
      
      // Find all possible next states from each current state
      let nextStates = [];
      
      currentStates.forEach(state => {
        const transitions = this.transitions[state][symbol];
        if (transitions && transitions.length > 0) {
          transitions.forEach(nextState => {
            if (!nextStates.includes(nextState)) {
              nextStates.push(nextState);
            }
          });
        }
      });
      
      // Apply epsilon closure to the next states
      nextStates = this.computeEpsilonClosure(nextStates);
      
      // If no next states, the input is rejected
      if (nextStates.length === 0) {
        return {
          accepted: false,
          finalStates: []
        };
      }
      
      currentStates = nextStates;
    }
    
    // Check if any final state is accepting
    const accepted = currentStates.some(state => this.acceptingStates.includes(state));
    
    return { accepted, finalStates: currentStates };
  }

  // Compute next states for a single step (used by simulation)
  computeNextStates(currentStates, symbol) {
    // Validate symbol
    if (!this.alphabet.includes(symbol)) {
      return {
        error: `Error: Character '${symbol}' is not in the alphabet.`,
        nextStates: []
      };
    }
    
    // Find all possible next states from each current state
    let nextStatesFromChar = [];
    const transitions = [];
    
    currentStates.forEach(state => {
      const stateTransitions = this.transitions[state][symbol] || [];
      
      stateTransitions.forEach(nextState => {
        if (!nextStatesFromChar.includes(nextState)) {
          nextStatesFromChar.push(nextState);
          transitions.push({ fromState: state, toState: nextState, symbol });
        }
      });
    });
    
    // Apply epsilon closure if enabled
    const nextStates = this.useEpsilonTransitions 
      ? this.computeEpsilonClosure(nextStatesFromChar) 
      : nextStatesFromChar;
    
    // Track epsilon transitions added during closure computation
    const epsilonTransitions = this.useEpsilonTransitions && 
      nextStates.length > nextStatesFromChar.length;
    
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
    
    return { 
      nextStates, 
      transitions, 
      epsilonTransitions, 
      epsilonDetails 
    };
  }

  // Toggle epsilon transitions
  setUseEpsilonTransitions(value) {
    this.useEpsilonTransitions = !!value;
    
    // Add or remove epsilon transitions as needed
    this.states.forEach(state => {
      if (this.useEpsilonTransitions && !this.transitions[state][this.epsilonSymbol]) {
        this.transitions[state][this.epsilonSymbol] = [];
      } else if (!this.useEpsilonTransitions && this.transitions[state][this.epsilonSymbol]) {
        delete this.transitions[state][this.epsilonSymbol];
      }
    });
    
    return this.useEpsilonTransitions;
  }

  // Static method to create from JSON
  static fromJSON(json) {
    if (json.type !== 'nfa') {
      throw new Error('Invalid JSON type for NFA');
    }
    return new NFAModel(json);
  }

  // Override toJSON to include epsilon settings
  toJSON() {
    const json = super.toJSON();
    json.epsilonSymbol = this.epsilonSymbol;
    json.useEpsilonTransitions = this.useEpsilonTransitions;
    return json;
  }
}