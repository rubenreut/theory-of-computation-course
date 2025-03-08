/**
 * Finite Automata Implementation
 * This class provides utility methods for working with DFAs and NFAs
 */

public class FiniteAutomaton {
    
    /**
     * Simulates a Deterministic Finite Automaton (DFA)
     * 
     * @param states Array of states
     * @param alphabet Array of characters in the alphabet
     * @param transitions Transition function (2D array)
     * @param startState Initial state
     * @param acceptStates Set of accepting states
     * @param input String to check
     * @return true if the input is accepted, false otherwise
     */
    public static boolean simulateDFA(
        String[] states,
        char[] alphabet,
        String[][] transitions,
        String startState,
        String[] acceptStates,
        String input
    ) {
        String currentState = startState;
        
        // Process each character in the input
        for (int i = 0; i < input.length(); i++) {
            char symbol = input.charAt(i);
            
            // Find the index of the current symbol in the alphabet
            int symbolIndex = -1;
            for (int j = 0; j < alphabet.length; j++) {
                if (alphabet[j] == symbol) {
                    symbolIndex = j;
                    break;
                }
            }
            
            // Symbol not in alphabet
            if (symbolIndex == -1) {
                return false;
            }
            
            // Find the index of the current state
            int stateIndex = -1;
            for (int j = 0; j < states.length; j++) {
                if (states[j].equals(currentState)) {
                    stateIndex = j;
                    break;
                }
            }
            
            // Update current state based on transition function
            currentState = transitions[stateIndex][symbolIndex];
            
            // If transition doesn't exist, reject
            if (currentState == null || currentState.isEmpty()) {
                return false;
            }
        }
        
        // Check if final state is accepting
        for (String acceptState : acceptStates) {
            if (acceptState.equals(currentState)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Simulates a Non-deterministic Finite Automaton (NFA)
     * This is a simplified version that doesn't handle epsilon transitions
     * 
     * @param states Array of states
     * @param alphabet Array of characters in the alphabet
     * @param transitions 3D array representing transitions (state, symbol, possible next states)
     * @param startState Initial state
     * @param acceptStates Set of accepting states
     * @param input String to check
     * @return true if the input is accepted, false otherwise
     */
    public static boolean simulateNFA(
        String[] states,
        char[] alphabet,
        String[][][] transitions,
        String startState,
        String[] acceptStates,
        String input
    ) {
        // Create set of current states (initially just the start state)
        java.util.Set<String> currentStates = new java.util.HashSet<>();
        currentStates.add(startState);
        
        // Process each character in the input
        for (int i = 0; i < input.length(); i++) {
            char symbol = input.charAt(i);
            
            // Find the index of the current symbol in the alphabet
            int symbolIndex = -1;
            for (int j = 0; j < alphabet.length; j++) {
                if (alphabet[j] == symbol) {
                    symbolIndex = j;
                    break;
                }
            }
            
            // Symbol not in alphabet
            if (symbolIndex == -1) {
                return false;
            }
            
            // Compute the next set of states
            java.util.Set<String> nextStates = new java.util.HashSet<>();
            
            for (String state : currentStates) {
                // Find the index of the current state
                int stateIndex = -1;
                for (int j = 0; j < states.length; j++) {
                    if (states[j].equals(state)) {
                        stateIndex = j;
                        break;
                    }
                }
                
                if (stateIndex != -1) {
                    // Add all possible next states
                    String[] possibleNextStates = transitions[stateIndex][symbolIndex];
                    if (possibleNextStates != null) {
                        for (String nextState : possibleNextStates) {
                            if (nextState != null && !nextState.isEmpty()) {
                                nextStates.add(nextState);
                            }
                        }
                    }
                }
            }
            
            // Update current states
            currentStates = nextStates;
            
            // If no valid transitions exist, reject
            if (currentStates.isEmpty()) {
                return false;
            }
        }
        
        // Check if any of the current states is accepting
        for (String acceptState : acceptStates) {
            if (currentStates.contains(acceptState)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Converts an NFA to an equivalent DFA
     * This is a simplified implementation of the powerset construction algorithm
     */
    public static void convertNFAtoDFA() {
        // Implementation of the powerset construction algorithm would go here
    }
}