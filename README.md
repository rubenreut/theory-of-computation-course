# Theory of Computation

A comprehensive interactive web application for learning and experimenting with theoretical computer science concepts, including Context-Free Grammars (CFGs), Deterministic Finite Automata (DFA), and Non-deterministic Finite Automata (NFA).

## Features

### Context-Free Grammars Module
- **Interactive Grammar Editor**
  - Create and edit context-free grammars
  - Define non-terminals, terminals, production rules, and start symbol
  - Real-time visualization of derivation trees
- **Parsing Visualizer**
  - CYK parsing algorithm implementation
  - Step-by-step visualization of parsing process
  - Test strings for membership in your grammar's language

### Automata Module
- **DFA Editor and Simulator**
  - Create and edit deterministic finite automata
  - Interactive state diagram with drag-and-drop interface
  - Step-by-step simulation with visual transitions
  - Test strings for acceptance by the automaton
- **NFA Editor and Simulator**
  - Create and edit non-deterministic finite automata
  - Visual representation of multiple possible paths
  - Concurrent state transitions simulation
  - String testing with detailed explanation

### Comprehensive Learning Resources
- Detailed explanations of theoretical computer science concepts
- Interactive tooltips that define technical terms
- Tabbed interface with multiple learning resources:
  - Comprehensive written content covering 40+ topics
  - Complete glossary with 25+ technical terms
  - Interactive exercises with immediate feedback
  - Visual comparisons of related concepts
  - Downloadable cheat sheets for quick reference

## Educational Components

### Glossary
- Detailed definitions of all key terms
- Examples for each concept
- Related terms navigation
- Categorized for easier learning

### Interactive Exercises
- Practice identifying grammar components and automata elements
- Step through derivations and automata simulations
- Test membership in context-free languages and regular languages
- Convert grammars to normal forms
- Understand state transitions and acceptance conditions

### Visual Comparisons
- CFG vs Regular Grammar
- DFA vs NFA
- Leftmost vs Rightmost Derivation
- Chomsky Normal Form vs Greibach Normal Form
- Top-Down vs Bottom-Up Parsing
- Context-Free vs Regular Languages
- Deterministic vs Non-deterministic Computation

### Tooltips
- Hover over technical terms for quick definitions
- Click terms to navigate to full glossary entries
- Automatic detection and linking of key terms in content

## Technical Implementation

### Frontend
- React.js for UI components
- D3.js for derivation tree visualization
- Styled-components for styling

### Architecture
- Component-based design
- Utility modules for grammar operations
- CYK parser implementation
- Interactive elements with state management

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm start

# If you encounter SSL issues, use the legacy provider
npm run start:legacy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.