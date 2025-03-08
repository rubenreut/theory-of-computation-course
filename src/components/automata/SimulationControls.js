import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${props => props.variant === 'nfa' 
      ? 'rgba(94, 92, 230, 0.4)' 
      : 'rgba(52, 199, 89, 0.4)'};
  }
  70% {
    box-shadow: 0 0 0 15px ${props => props.variant === 'nfa' 
      ? 'rgba(94, 92, 230, 0)' 
      : 'rgba(52, 199, 89, 0)'};
  }
  100% {
    box-shadow: 0 0 0 0 ${props => props.variant === 'nfa' 
      ? 'rgba(94, 92, 230, 0)' 
      : 'rgba(52, 199, 89, 0)'};
  }
`;

const moveUpDown = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Simulation title
export const SimulationTitle = styled.h4`
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: var(--spacing-sm);
    color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  }
`;

// Controls container
export const SimulationControlsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
`;

// Buttons
export const ControlButton = styled.button`
  background-color: ${props => props.primary 
    ? (props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)')
    : 'white'};
  color: ${props => props.primary 
    ? 'white' 
    : (props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)')};
  border: 2px solid ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 600;
  font-size: var(--font-size-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    margin-right: 4px;
  }
`;

// Speed control
export const SpeedContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

export const SpeedLabel = styled.label`
  font-weight: 600;
  color: var(--text-secondary);
`;

export const SpeedSlider = styled.input`
  appearance: none;
  width: 120px;
  height: 8px;
  border-radius: 4px;
  background: #e0e0e0;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
    cursor: pointer;
  }
`;

// Current input visualization
export const CurrentInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  
  span {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid var(--border-color);
    margin: 3px;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    font-size: var(--font-size-lg);
    min-width: 40px;
    text-align: center;
  }
  
  span.current {
    border-color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
    background-color: ${props => props.variant === 'nfa' 
      ? 'rgba(94, 92, 230, 0.1)' 
      : 'rgba(52, 199, 89, 0.1)'};
    animation: ${pulse} 1.5s infinite;
  }
  
  span.processed {
    background-color: #f0f0f0;
    color: var(--text-secondary);
  }
  
  span.remaining {
    background-color: white;
  }
  
  span.path-marker {
    background-color: transparent;
    border: none;
    font-weight: bold;
    padding: 0 5px;
  }
`;

// State info display
export const StepInfo = styled.div`
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: #f8f9fa;
  border-radius: var(--border-radius-md);
  border-left: 4px solid ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
`;

export const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  color: white;
  border-radius: 50%;
  margin-right: var(--spacing-sm);
  font-weight: bold;
  animation: ${moveUpDown} 2s ease-in-out infinite;
`;

export const SymbolBadge = styled.span`
  display: inline-block;
  background-color: ${props => props.variant === 'nfa' 
    ? 'rgba(94, 92, 230, 0.1)' 
    : 'rgba(52, 199, 89, 0.1)'};
  color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  font-size: var(--font-size-base);
  padding: 4px 8px;
  border-radius: 12px;
  margin: 0 3px;
  font-weight: 600;
`;

// SVG Icons
export const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

export const ResetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v6h6"></path>
    <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
  </svg>
);

export const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="19 20 9 12 19 4 19 20"></polygon>
    <line x1="5" y1="19" x2="5" y2="5"></line>
  </svg>
);

export const ForwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
);

export const SimulationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
  </svg>
);

// Main component
const SimulationControls = ({
  simulationState,
  testInput,
  setTestInput,
  startSimulation,
  pauseSimulation,
  resumeSimulation,
  stopSimulation,
  handleStepForward,
  handleStepBackward,
  handleSpeedChange,
  variant = 'dfa',
  showCurrentStates = false
}) => {
  return (
    <>
      <SimulationTitle variant={variant}>
        <SimulationIcon /> Simulation Controls
      </SimulationTitle>
      
      <InputContainer>
        <TestInput 
          type="text" 
          value={testInput}
          onChange={e => setTestInput(e.target.value)}
          placeholder="Enter input string..."
          variant={variant}
        />
        <ControlButton variant={variant} onClick={startSimulation}>Restart</ControlButton>
      </InputContainer>
      
      <CurrentInput variant={variant}>
        {simulationState.processedInput.split('').map((char, index) => (
          <span key={`p-${index}`} className="processed">{char}</span>
        ))}
        
        {simulationState.remainingInput.length > 0 ? (
          <>
            <span key="c-current" className="current">{simulationState.remainingInput[0]}</span>
            
            {simulationState.remainingInput.slice(1).split('').map((char, index) => (
              <span key={`r-${index}`} className="remaining">{char}</span>
            ))}
          </>
        ) : null}
      </CurrentInput>
      
      <StepInfo variant={variant}>
        <InfoIcon variant={variant}>i</InfoIcon>
        
        {!showCurrentStates ? (
          // DFA - Single current state
          <>
            Current State: <strong>{simulationState.currentState}</strong>
            {simulationState.isComplete && (
              <span> (Final State: {simulationState.isAccepting ? 'Accepting' : 'Non-accepting'})</span>
            )}
          </>
        ) : (
          // NFA - Multiple possible states
          <>
            Current States: 
            {simulationState.currentStates && simulationState.currentStates.length > 0 ? (
              simulationState.currentStates.map((state, index) => (
                <SymbolBadge key={state} variant={variant}>
                  {state}
                </SymbolBadge>
              ))
            ) : (
              <SymbolBadge variant={variant}>None (Rejected)</SymbolBadge>
            )}
            
            {simulationState.isComplete && (
              <div style={{ marginTop: '10px' }}>
                Final Result: {simulationState.isAccepting ? 'Accepted ✓' : 'Rejected ✗'}
              </div>
            )}
          </>
        )}
      </StepInfo>
      
      <SimulationControlsContainer>
        <ControlButton 
          onClick={handleStepBackward} 
          disabled={simulationState.currentStep === 0}
          variant={variant}
        >
          <BackIcon /> Step Back
        </ControlButton>
        
        {simulationState.isPaused || simulationState.isComplete ? (
          <ControlButton 
            primary 
            onClick={resumeSimulation} 
            disabled={simulationState.isComplete}
            variant={variant}
          >
            <PlayIcon /> Continue
          </ControlButton>
        ) : (
          <ControlButton 
            primary 
            onClick={pauseSimulation} 
            disabled={!simulationState.isRunning || simulationState.isComplete}
            variant={variant}
          >
            <PauseIcon /> Pause
          </ControlButton>
        )}
        
        <ControlButton 
          onClick={handleStepForward} 
          disabled={simulationState.isComplete}
          variant={variant}
        >
          <ForwardIcon /> Step Forward
        </ControlButton>
        
        <ControlButton 
          onClick={stopSimulation} 
          disabled={!simulationState.isRunning}
          variant={variant}
        >
          <ResetIcon /> Reset
        </ControlButton>
      </SimulationControlsContainer>
      
      <SpeedContainer>
        <SpeedLabel>Speed:</SpeedLabel>
        <SpeedSlider 
          type="range" 
          min="100" 
          max="1000" 
          step="100" 
          value={simulationState.speed}
          onChange={handleSpeedChange}
          variant={variant}
        />
        <span>{simulationState.speed}ms</span>
      </SpeedContainer>
    </>
  );
};

export default SimulationControls;