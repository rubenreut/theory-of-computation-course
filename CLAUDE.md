# Context-Free Grammars App

This document helps Claude understand the structure and key components of this educational application focused on context-free grammars and automata theory.

## Project Overview

This is an educational web application for learning about:
- Context-Free Grammars (CFG)
- Deterministic Finite Automata (DFA)
- Non-deterministic Finite Automata (NFA)

The application includes interactive editors, visualizations, and simulations for these theoretical computer science concepts.

## Key Code Structure

### Main Modules

- `/src/pages/cfg/` - Context-Free Grammar module files
- `/src/pages/automata/` - Automata (DFA/NFA) module files
- `/src/components/` - Reusable UI components
- `/src/utils/` - Helper functions and algorithm implementations
- `/src/context/` - React context providers

### Important Components

- `GrammarEditor.js` - Editor for creating/editing CFGs
- `DerivationTree.js` - Visualization for CFG derivation trees
- `DFAEditor.js` - Editor and simulation for DFAs
- `NFAEditor.js` - Editor and simulation for NFAs
- `Parser.js` - CYK parsing algorithm implementation

### Key Utilities

- `cykParser.js` - CYK (Cocke-Younger-Kasami) parsing algorithm
- `grammarUtils.js` - Functions for working with CFGs

## Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests (when available)
npm run test
```

## Component Structure and State Management

The application uses React context for state management:

- `CFGContext.js` - Manages CFG state and operations
- `SettingsContext.js` - Manages UI settings and preferences

## Canvas Rendering Notes

Both the `DFAEditor.js` and `NFAEditor.js` components use HTML Canvas for rendering visualizations:

1. Canvas initialization happens in useEffect hooks
2. They rely on `canvasRef` and `canvasContainerRef` for sizing
3. The `renderDFA()` and `renderNFA()` functions handle the drawing logic
4. Zoom and pan functionality is implemented for interactive visualizations

## Algorithm Implementation Details

### CYK Parser

The CYK algorithm in `cykParser.js` determines if a string can be derived from a context-free grammar in Chomsky Normal Form. Key functions:

- `parseCYK(grammar, inputString)` - Main parsing function
- `isChomskyNormalForm(grammar)` - Validates grammar format
- `convertToCNF(grammar)` - Converts grammar to Chomsky Normal Form

## Styling

The application uses styled-components with CSS variables for theming. The main style variables are defined in `src/styles/main.css`.

## Future Improvements

Planned improvements include:
- Additional algorithms for CFG analysis
- More interactive examples
- Step-by-step algorithm visualization
- Mobile-responsive design enhancements