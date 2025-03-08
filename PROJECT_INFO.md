# Theory of Computation - Project Overview

This document provides a comprehensive overview of the Theory of Computation project, including its structure, key components, algorithms, and technologies.

## Project Description

This educational web application serves as an interactive learning platform for theoretical computer science concepts, specifically:

1. Context-Free Grammars (CFG)
2. Deterministic Finite Automata (DFA)
3. Non-deterministic Finite Automata (NFA)

The application includes interactive editors, visual simulations, and educational content to help students understand these fundamental concepts in formal language theory and automata.

## Project Structure

```
/theory-of-computation/
├── public/                  # Static assets and HTML entry point
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── automata/        # DFA and NFA modules
│   │   └── cfg/             # Context-Free Grammar modules
│   ├── styles/              # Global styles
│   ├── utils/               # Helper functions and algorithms
│   ├── App.js               # Main app component
│   └── index.js             # Application entry point
└── package.json             # Dependencies and scripts
```

## Key Modules

### Context-Free Grammar Module (`/src/pages/cfg/`)

- **CFGEditor.js**: Interactive editor for creating and editing context-free grammars
- **CFGExamples.js**: Pre-defined examples of context-free grammars
- **CFGComparisons.js**: Visual comparisons between different types of grammars
- **CFGCheatSheet.js**: Quick reference for context-free grammar concepts
- **CFGIntroduction.js**: Educational content introducing CFG concepts

### Automata Module (`/src/pages/automata/`)

- **DFAEditor.js**: Interactive editor and simulator for deterministic finite automata
- **NFAEditor.js**: Interactive editor and simulator for non-deterministic finite automata
- **AutomataExamples.js**: Pre-defined examples of automata
- **AutomataComparisons.js**: Visual comparisons between different types of automata
- **AutomataCheatSheet.js**: Quick reference for automata concepts
- **AutomataIntroduction.js**: Educational content introducing automata concepts

## Core Components

- **GrammarEditor.js**: Editor component for CFGs with syntax validation
- **DerivationTree.js**: Visual representation of derivation trees for CFGs
- **Parser.js**: Implementation of parsing algorithms (CYK)
- **Tooltip.js & TooltipText.js**: Interactive tooltips for technical terms
- **CheatSheet.js**: Template component for reference sheets
- **GuidedExercise.js**: Interactive exercises with step-by-step solutions
- **StepByStepAlgorithm.js**: Visual representation of algorithm execution
- **Glossary.js**: Reference for technical terms and definitions

## Key Utilities

- **cykParser.js** (`/src/utils/`): Implementation of the Cocke-Younger-Kasami parsing algorithm for context-free grammars
- **grammarUtils.js** (`/src/utils/`): Utility functions for manipulating and validating grammars

## State Management

The application uses React's Context API for state management:

- **CFGContext.js**: Manages the state of context-free grammars
- **SettingsContext.js**: Manages application settings and preferences

## Key Functionality

### DFA/NFA Simulation

The DFA and NFA editors (**DFAEditor.js**, **NFAEditor.js**) provide:
- Visual canvas-based representation of automata
- Step-by-step simulation of input processing
- Visual highlighting of state transitions
- Input validation and testing
- Pan and zoom controls for the visualization

### Context-Free Grammar Parsing

The CFG module provides:
- Grammar validation and normalization
- CYK parsing algorithm implementation
- Derivation tree visualization
- Example generation from grammars

## Technologies and Libraries

- **React**: UI library for building the component-based interface
- **Styled Components**: CSS-in-JS styling solution
- **Canvas API**: For drawing automata visualizations
- **HTML/CSS/JavaScript**: Core web technologies

### UI Components and Styling

- Responsive layouts using CSS Grid and Flexbox
- CSS transitions and animations for interactive elements
- Canvas-based visualizations for automata and derivation trees

## Algorithms Implemented

1. **CYK Parsing Algorithm**: For determining if a string belongs to a context-free language
2. **DFA Simulation**: For testing if a string is accepted by a deterministic finite automaton
3. **NFA Simulation**: For testing if a string is accepted by a non-deterministic finite automaton
4. **Grammar Transformations**: Functions for converting grammars to Chomsky Normal Form

## Key Features

- **Interactive Editors**: Visual editors for creating and editing grammars and automata
- **Step-by-Step Simulations**: Visual walkthrough of algorithm execution
- **Visual Comparisons**: Side-by-side comparisons of different concepts
- **Educational Content**: Explanatory text, examples, and references
- **Guided Exercises**: Interactive problems with hints and solutions
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility Features**: Support for keyboard navigation and screen readers

## Future Enhancements

1. Epsilon-NFA support in the automata module
2. Push-down automata simulation
3. More parsing algorithms (Earley, LL, LR)
4. Grammar transformation tools
5. Turing machine simulation
6. Export/import functionality for saving work
7. User accounts for progress tracking
8. More interactive exercises and quizzes

## Development Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Legacy compatibility mode
npm run start:legacy
npm run build:legacy
```

This overview provides a comprehensive understanding of the project's structure, components, and functionality, serving as a reference for developers working on or extending the application.