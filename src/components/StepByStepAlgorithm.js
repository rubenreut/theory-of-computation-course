import React, { useState } from 'react';
import styled from 'styled-components';

const AlgorithmContainer = styled.div`
  background: var(--surface-color);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 30px var(--shadow-color);
  margin: var(--spacing-xl) 0;
  border: 2px solid var(--border-color);
`;

const StepControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-lg);
  gap: var(--spacing-md);
`;

const StepButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'var(--surface-color)'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  border: 2px solid ${props => props.primary ? 'var(--primary-color)' : 'var(--border-color)'};
  padding: 15px 30px;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.primary ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
    transform: translateY(-2px);
  }
  
  transition: all 0.2s ease;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: var(--border-color);
  border-radius: 6px;
  margin: var(--spacing-md) 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => (props.step / (props.totalSteps - 1)) * 100}%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
`;

const StepDisplay = styled.div`
  margin-bottom: var(--spacing-md);
  font-weight: 600;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
`;

const StepContent = styled.div`
  background-color: ${props => props.active ? 'rgba(0, 113, 227, 0.05)' : 'transparent'};
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  border: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  transition: all 0.3s ease;
`;

const VisualizationArea = styled.div`
  width: 100%;
  min-height: 350px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-lg);
  background-color: var(--background-color);
`;

const AlgorithmTitle = styled.h3`
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
`;

const StepByStepAlgorithm = ({ title, steps, visualization }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(0);
  };
  
  return (
    <AlgorithmContainer>
      <AlgorithmTitle>{title}</AlgorithmTitle>
      
      <StepDisplay>
        Step {currentStep + 1} of {totalSteps}
      </StepDisplay>
      
      <ProgressBar>
        <ProgressFill step={currentStep} totalSteps={totalSteps} />
      </ProgressBar>
      
      {steps.map((step, index) => (
        <StepContent 
          key={index} 
          active={currentStep === index}
          style={{ display: currentStep === index ? 'block' : 'none' }}
        >
          <h4 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '10px' }}>{step.title}</h4>
          <p style={{ fontSize: 'var(--font-size-base)' }}>{step.description}</p>
        </StepContent>
      ))}
      
      <VisualizationArea>
        {visualization ? visualization(currentStep) : <p style={{ fontSize: 'var(--font-size-lg)' }}>Visualization will appear here</p>}
      </VisualizationArea>
      
      <StepControls>
        <div>
          <StepButton onClick={handleReset}>Reset</StepButton>
        </div>
        <div>
          <StepButton 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
            style={{ marginRight: 'var(--spacing-md)' }}
          >
            Previous
          </StepButton>
          <StepButton 
            primary 
            onClick={handleNext} 
            disabled={currentStep === totalSteps - 1}
          >
            Next
          </StepButton>
        </div>
      </StepControls>
    </AlgorithmContainer>
  );
};

export default StepByStepAlgorithm;