import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import styled from 'styled-components';
import AutomataCanvas from '../AutomataCanvas';
import CanvasManager from '../../../utils/automata/CanvasManager';

// Styled components
export const VisualizationPanel = styled.div`
  width: 100%;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-xl);
  border: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

export const PanelHeader = styled.div`
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PanelTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
`;

/**
 * AutomataVisualizationBase component
 * 
 * A reusable component for visualizing automata (DFA/NFA).
 * Performance optimized with memoization and efficient rendering.
 * 
 * @param {Object} props Component props
 * @param {string} props.title The title of the visualization panel
 * @param {string} props.variant The variant of the automaton ('dfa' or 'nfa')
 * @param {Object} props.automaton The automaton model
 * @param {Object} props.simulationState Current simulation state (optional)
 * @param {Function} props.renderFunction Custom render function for the automaton
 * @param {boolean} props.isLoading Whether the visualization is loading
 * @param {string} props.loadingMessage Loading message to display
 * @param {React.ReactNode} props.headerControls Additional controls to render in the header
 * @param {React.ReactNode} props.children Content to render below the visualization
 */
const AutomataVisualizationBase = ({
  title,
  variant = 'dfa',
  automaton,
  simulationState = {},
  renderFunction: customRenderFunction,
  isLoading = false,
  loadingMessage = 'Preparing visualization...',
  headerControls,
  children
}) => {
  // Canvas management
  const canvasManagerRef = useRef(null);
  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false);
  const renderFrameIdRef = useRef(null);
  
  // Track states and transitions for optimized rendering
  const statesRef = useRef([]);
  const transitionsRef = useRef({});
  const animationStateRef = useRef({});
  
  // Initialize canvas manager when canvas ref becomes available
  const initCanvasManager = useCallback((canvasRef) => {
    if (!canvasRef) return;
    
    // Set color scheme based on variant
    const colorSettings = {
      stateRadius: 30,
      activeStateFill: variant === 'dfa' 
        ? 'rgba(52, 199, 89, 0.9)' 
        : 'rgba(94, 92, 230, 0.9)',
      activeStateStroke: variant === 'dfa'
        ? 'rgba(52, 199, 89, 1)'
        : 'rgba(94, 92, 230, 1)'
    };
    
    canvasManagerRef.current = new CanvasManager(canvasRef, colorSettings);
    setIsCanvasInitialized(true);
  }, [variant]);

  // Check if automaton structure has changed
  const hasAutomatonChanged = useCallback(() => {
    if (!automaton) return false;
    
    // Check if states have changed
    if (statesRef.current.length !== automaton.states.length) {
      return true;
    }
    
    // Check if state elements have changed
    for (let i = 0; i < automaton.states.length; i++) {
      if (statesRef.current[i] !== automaton.states[i]) {
        return true;
      }
    }
    
    // Check if transitions have changed (simple reference check for efficiency)
    if (transitionsRef.current !== automaton.transitions) {
      return true;
    }
    
    return false;
  }, [automaton]);
  
  // Update state and transition refs when automaton changes
  useEffect(() => {
    if (automaton) {
      statesRef.current = [...automaton.states];
      transitionsRef.current = automaton.transitions;
    }
  }, [automaton]);
  
  // Update animation state refs for optimized checks
  useEffect(() => {
    if (simulationState) {
      animationStateRef.current = {
        currentState: simulationState.currentState,
        currentStates: simulationState.currentStates,
        isRunning: simulationState.isRunning,
        path: simulationState.path
      };
    }
  }, [simulationState]);
  
  // Default DFA render function with optimizations
  const renderDFA = useCallback(() => {
    if (!canvasManagerRef.current || !isCanvasInitialized || !automaton) return;
    
    const manager = canvasManagerRef.current;
    
    // Cache current positions
    const shouldRecalculatePositions = hasAutomatonChanged() || 
      Object.keys(manager.statePositions).length !== automaton.states.length;
    
    // Clear canvas and apply transformations
    manager.clear();
    manager.applyTransform();
    
    // Calculate state positions only if needed
    const positions = shouldRecalculatePositions
      ? manager.calculateStatePositions(automaton.states)
      : manager.statePositions;
    
    // Draw transitions
    automaton.states.forEach(fromState => {
      const fromPos = positions[fromState];
      if (!fromPos) return;
      
      automaton.alphabet.forEach(symbol => {
        const toState = automaton.transitions[fromState][symbol];
        if (!toState) return;
        
        const toPos = positions[toState];
        if (!toPos) return;
        
        // Check if this transition is active in the simulation - optimized to avoid deep checks when possible
        const isActive = animationStateRef.current.path?.some((step, idx) => 
          idx > 0 && 
          step.fromState === fromState && 
          step.state === toState && 
          step.input === symbol
        );
        
        manager.drawTransition(fromState, toState, fromPos, toPos, {
          symbol,
          isActive
        });
      });
    });
    
    // Draw states
    automaton.states.forEach(state => {
      const pos = positions[state];
      if (!pos) return;
      
      // Determine if the state is active in the simulation - optimized check
      const isActive = animationStateRef.current.currentState === state && 
                      animationStateRef.current.isRunning;
      const isAccepting = automaton.acceptingStates.includes(state);
      const isInitial = automaton.initialState === state;
      
      manager.drawState(state, pos, {
        isActive,
        isAccepting,
        isInitial
      });
    });
    
    // Reset transformation
    manager.resetTransform();
  }, [automaton, isCanvasInitialized, hasAutomatonChanged]);
  
  // Default NFA render function with optimizations
  const renderNFA = useCallback(() => {
    if (!canvasManagerRef.current || !isCanvasInitialized || !automaton) return;
    
    const manager = canvasManagerRef.current;
    const showEpsilon = automaton.useEpsilonTransitions !== false;
    
    // Cache current positions
    const shouldRecalculatePositions = hasAutomatonChanged() || 
      Object.keys(manager.statePositions).length !== automaton.states.length;
    
    // Clear canvas and apply transformations
    manager.clear();
    manager.applyTransform();
    
    // Calculate state positions only if needed
    const positions = shouldRecalculatePositions
      ? manager.calculateStatePositions(automaton.states)
      : manager.statePositions;
    
    // Draw transitions
    automaton.states.forEach(fromState => {
      const fromPos = positions[fromState];
      if (!fromPos) return;
      
      // First draw regular transitions
      automaton.alphabet.forEach(symbol => {
        const toStates = automaton.transitions[fromState][symbol] || [];
        
        toStates.forEach(toState => {
          const toPos = positions[toState];
          if (!toPos) return;
          
          // Check if this transition is active - optimized check
          const isActive = animationStateRef.current.path?.some((step, idx) => 
            idx > 0 && 
            step.transitions && 
            step.transitions.some(t => 
              t.fromState === fromState && 
              t.toState === toState && 
              t.symbol === symbol
            )
          );
          
          manager.drawTransition(fromState, toState, fromPos, toPos, {
            symbol,
            isActive,
            strokeColor: isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            textColor: isActive ? 'var(--tertiary-color)' : 'black'
          });
        });
      });
      
      // Then draw epsilon transitions if enabled
      if (showEpsilon) {
        const epsilonToStates = automaton.transitions[fromState]['ε'] || [];
        
        epsilonToStates.forEach(toState => {
          const toPos = positions[toState];
          if (!toPos) return;
          
          // Check if this epsilon transition is active - optimized check
          const isActive = animationStateRef.current.path?.some((step, idx) => 
            idx > 0 && 
            step.epsilonDetails && 
            step.epsilonDetails.some(e => e.toState === toState)
          );
          
          manager.drawTransition(fromState, toState, fromPos, toPos, {
            symbol: 'ε',
            isActive,
            isDashed: true,
            strokeColor: isActive ? 'rgba(94, 92, 230, 0.8)' : 'rgba(0, 0, 0, 0.6)',
            textColor: isActive ? 'var(--tertiary-color)' : 'black'
          });
        });
      }
    });
    
    // Draw states
    automaton.states.forEach(state => {
      const pos = positions[state];
      if (!pos) return;
      
      // Determine if the state is active - optimized check
      const isActive = animationStateRef.current.currentStates &&
                       animationStateRef.current.currentStates.includes(state) &&
                       animationStateRef.current.isRunning;
      const isAccepting = automaton.acceptingStates.includes(state);
      const isInitial = automaton.initialState === state;
      
      manager.drawState(state, pos, {
        isActive,
        isAccepting,
        isInitial
      });
    });
    
    // Reset transformation
    manager.resetTransform();
  }, [automaton, isCanvasInitialized, hasAutomatonChanged]);
  
  // Choose appropriate render function
  const renderFunction = useCallback(() => {
    // Cancel any pending renders to avoid flickering
    if (renderFrameIdRef.current) {
      cancelAnimationFrame(renderFrameIdRef.current);
    }
    
    // Schedule a render on the next frame for better performance
    renderFrameIdRef.current = requestAnimationFrame(() => {
      if (customRenderFunction) {
        customRenderFunction();
      } else {
        variant === 'dfa' ? renderDFA() : renderNFA();
      }
    });
  }, [customRenderFunction, variant, renderDFA, renderNFA]);
  
  // Update canvas when dependencies change
  useEffect(() => {
    if (isCanvasInitialized) {
      renderFunction();
    }
    
    // Cleanup function to cancel any pending animations
    return () => {
      if (renderFrameIdRef.current) {
        cancelAnimationFrame(renderFrameIdRef.current);
      }
    };
  }, [isCanvasInitialized, renderFunction, automaton, simulationState]);
  
  // Prepare canvas props
  const canvasProps = {
    initRef: initCanvasManager,
    canvasManager: canvasManagerRef.current,
    renderFunction,
    isLoading,
    variant,
    loadingMessage
  };
  
  return (
    <VisualizationPanel>
      <PanelHeader>
        <PanelTitle>{title}</PanelTitle>
        {headerControls && headerControls}
      </PanelHeader>
      
      <AutomataCanvas {...canvasProps} />
      
      {children}
    </VisualizationPanel>
  );
};

// Apply React.memo for preventing unnecessary re-renders
const AutomataVisualization = memo(AutomataVisualizationBase, (prevProps, nextProps) => {
  // Custom comparison function to only re-render when necessary
  
  // Always re-render if loading state changes
  if (prevProps.isLoading !== nextProps.isLoading) {
    return false;
  }
  
  // If automaton references change, we need to re-render
  if (prevProps.automaton !== nextProps.automaton) {
    return false;
  }
  
  // Check if simulation state has important changes
  if (prevProps.simulationState !== nextProps.simulationState) {
    const prevSim = prevProps.simulationState || {};
    const nextSim = nextProps.simulationState || {};
    
    // Check critical properties that affect rendering
    if (
      prevSim.currentState !== nextSim.currentState ||
      prevSim.isRunning !== nextSim.isRunning ||
      prevSim.currentStates !== nextSim.currentStates ||
      prevSim.path !== nextSim.path
    ) {
      return false;
    }
  }
  
  // Re-render if title or variant changes
  if (prevProps.title !== nextProps.title || prevProps.variant !== nextProps.variant) {
    return false;
  }
  
  // By default, don't re-render
  return true;
});

export default AutomataVisualization;