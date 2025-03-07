import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ExampleContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ExampleTitle = styled.h3`
  color: #2e7d32;
  margin-top: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
`;

const TitleIcon = styled.span`
  margin-right: 10px;
  font-size: 1.2em;
`;

const DescriptionText = styled.p`
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const InteractionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StepCounter = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Step = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4CAF50' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#757575'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 5px;
  transition: all 0.3s ease;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const ResultArea = styled.div`
  background-color: ${props => props.success ? '#e8f5e9' : props.error ? '#ffebee' : '#fff'};
  border: 1px solid ${props => props.success ? '#a5d6a7' : props.error ? '#ffcdd2' : '#e0e0e0'};
  border-radius: 4px;
  padding: 15px;
  margin-top: 10px;
  transition: all 0.3s ease;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${props => props.primary ? '#4CAF50' : '#f5f5f5'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#43A047' : '#e0e0e0'};
  }
  
  &:disabled {
    background-color: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const HintButton = styled.button`
  background: none;
  border: none;
  color: #2196f3;
  text-decoration: underline;
  cursor: pointer;
  padding: 5px;
  font-size: 14px;
  
  &:hover {
    color: #1976d2;
  }
`;

const HintText = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
  border-radius: 4px;
  font-style: italic;
`;

const ExplanationText = styled.div`
  margin-top: 15px;
  line-height: 1.6;
  color: #333;
  padding: 10px;
  background-color: ${props => props.highlight ? '#fff8e1' : 'transparent'};
  border-left: ${props => props.highlight ? '3px solid #ffc107' : 'none'};
  border-radius: ${props => props.highlight ? '4px' : '0'};
`;

// Generic interactive example component that can be configured for different scenarios
function InteractiveExample({ 
  title, 
  description, 
  steps, 
  validator,
  initialInput = '',
  placeholder = 'Enter your answer...',
  showStepNumbers = true,
  allowSkip = false
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState(initialInput);
  const [result, setResult] = useState({ message: '', status: 'neutral' });
  const [showHint, setShowHint] = useState(false);
  const [complete, setComplete] = useState(false);
  
  // Reset state when example changes
  useEffect(() => {
    setCurrentStep(0);
    setUserInput(initialInput);
    setResult({ message: '', status: 'neutral' });
    setShowHint(false);
    setComplete(false);
  }, [title, initialInput]);
  
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    // Clear previous result when user types
    if (result.message) {
      setResult({ message: '', status: 'neutral' });
    }
    setShowHint(false);
  };
  
  const handleCheck = () => {
    const stepValidator = validator || steps[currentStep].validator;
    
    if (stepValidator) {
      const validationResult = stepValidator(userInput);
      setResult(validationResult);
      
      if (validationResult.status === 'success') {
        if (currentStep === steps.length - 1) {
          setComplete(true);
        }
      }
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserInput(steps[currentStep + 1].initialInput || '');
      setResult({ message: '', status: 'neutral' });
      setShowHint(false);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setUserInput(steps[currentStep - 1].initialInput || '');
      setResult({ message: '', status: 'neutral' });
      setShowHint(false);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setUserInput(steps[0].initialInput || initialInput);
    setResult({ message: '', status: 'neutral' });
    setShowHint(false);
    setComplete(false);
  };
  
  const currentStepData = steps[currentStep];
  
  return (
    <ExampleContainer>
      <ExampleTitle>
        <TitleIcon>🔍</TitleIcon>
        {title}
      </ExampleTitle>
      
      <DescriptionText>{description}</DescriptionText>
      
      {showStepNumbers && steps.length > 1 && (
        <StepCounter>
          {steps.map((_, index) => (
            <Step key={index} active={index === currentStep}>
              {index + 1}
            </Step>
          ))}
        </StepCounter>
      )}
      
      <InteractionArea>
        <InputContainer>
          <InputLabel>{currentStepData.prompt}</InputLabel>
          <TextInput 
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder={currentStepData.placeholder || placeholder}
          />
        </InputContainer>
        
        {result.message && (
          <ResultArea success={result.status === 'success'} error={result.status === 'error'}>
            {result.message}
          </ResultArea>
        )}
        
        <ButtonGroup>
          <Button 
            primary 
            onClick={handleCheck}
            disabled={!userInput.trim()}
          >
            Check Answer
          </Button>
          
          {steps.length > 1 && (
            <>
              <Button 
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                Previous Step
              </Button>
              
              <Button 
                onClick={handleNextStep}
                disabled={
                  currentStep === steps.length - 1 || 
                  (!allowSkip && result.status !== 'success')
                }
              >
                Next Step
              </Button>
            </>
          )}
          
          {complete && (
            <Button onClick={handleReset}>
              Start Over
            </Button>
          )}
        </ButtonGroup>
        
        <div>
          <HintButton onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </HintButton>
          
          {showHint && currentStepData.hint && (
            <HintText>{currentStepData.hint}</HintText>
          )}
        </div>
      </InteractionArea>
      
      {currentStepData.explanation && (
        <ExplanationText highlight={result.status === 'success' || complete}>
          {currentStepData.explanation}
        </ExplanationText>
      )}
    </ExampleContainer>
  );
}

export default InteractiveExample;