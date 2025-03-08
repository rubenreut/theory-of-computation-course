import React, { useState } from 'react';
import styled from 'styled-components';

const ExerciseContainer = styled.div`
  background: var(--surface-color);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 30px var(--shadow-color);
  margin: var(--spacing-xl) 0;
  border: 2px solid var(--border-color);
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ExerciseTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 700;
`;

const DifficultyBadge = styled.span`
  padding: 10px 20px;
  border-radius: 25px;
  font-size: var(--font-size-base);
  font-weight: 600;
  background-color: ${props => {
    switch(props.level) {
      case 'easy': return 'rgba(52, 199, 89, 0.2)';
      case 'medium': return 'rgba(255, 149, 0, 0.2)';
      case 'hard': return 'rgba(255, 59, 48, 0.2)';
      default: return 'rgba(52, 199, 89, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.level) {
      case 'easy': return 'var(--success-color)';
      case 'medium': return 'var(--warning-color)';
      case 'hard': return 'var(--danger-color)';
      default: return 'var(--success-color)';
    }
  }};
`;

const ExerciseDescription = styled.p`
  margin-bottom: var(--spacing-lg);
  line-height: 1.7;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
`;

const HintContainer = styled.div`
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: rgba(0, 113, 227, 0.05);
  border-radius: var(--border-radius-md);
  border-left: 6px solid var(--primary-color);
  display: ${props => props.visible ? 'block' : 'none'};
`;

const SolutionContainer = styled.div`
  margin-top: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: rgba(52, 199, 89, 0.05);
  border-radius: var(--border-radius-md);
  border-left: 6px solid var(--success-color);
  display: ${props => props.visible ? 'block' : 'none'};
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--primary-color)'};
  border: 2px solid ${props => props.primary ? 'var(--primary-color)' : 'var(--primary-color)'};
  padding: 12px 24px;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-right: var(--spacing-md);
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.primary ? 'var(--primary-color)' : 'rgba(0, 113, 227, 0.05)'};
    transform: translateY(-2px);
  }
  
  transition: all 0.2s ease;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-secondary);
  margin-right: var(--spacing-md);
`;

const FeedbackMessage = styled.div`
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  font-weight: 600;
  text-align: center;
  background-color: ${props => props.success ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)'};
  color: ${props => props.success ? 'var(--success-color)' : 'var(--danger-color)'};
  display: ${props => props.visible ? 'block' : 'none'};
`;

const GuidedExercise = ({ 
  title, 
  difficulty = 'medium', 
  description, 
  hint, 
  solution,
  userComponents, // User input components specific to this exercise
  onCheck, // Function to check the solution
  onNext, // Function to move to next exercise
  exerciseNumber, 
  totalExercises
}) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleCheckAnswer = () => {
    const result = onCheck ? onCheck() : false;
    setIsCorrect(result);
    setShowFeedback(true);
    
    // Hide feedback after 3 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };
  
  return (
    <ExerciseContainer>
      <ExerciseHeader>
        <ExerciseTitle>{title}</ExerciseTitle>
        <DifficultyBadge level={difficulty}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </DifficultyBadge>
      </ExerciseHeader>
      
      <ExerciseDescription>{description}</ExerciseDescription>
      
      {userComponents}
      
      <FeedbackMessage visible={showFeedback} success={isCorrect}>
        {isCorrect ? 'Correct! Great job! 🎉' : 'Not quite right. Try again or check the hint. 🤔'}
      </FeedbackMessage>
      
      <HintContainer visible={showHint}>
        <h4 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '10px' }}>Hint:</h4>
        <p style={{ fontSize: 'var(--font-size-base)' }}>{hint}</p>
      </HintContainer>
      
      <SolutionContainer visible={showSolution}>
        <h4 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '10px' }}>Solution:</h4>
        <div>{solution}</div>
      </SolutionContainer>
      
      <ActionContainer>
        <div>
          <ActionButton onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </ActionButton>
          <ActionButton onClick={() => setShowSolution(!showSolution)}>
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </ActionButton>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ProgressIndicator>
            Exercise {exerciseNumber} of {totalExercises}
          </ProgressIndicator>
          <ActionButton onClick={handleCheckAnswer}>
            Check Answer
          </ActionButton>
          <ActionButton 
            primary 
            onClick={onNext}
            disabled={!isCorrect && !showSolution}
          >
            Next Exercise
          </ActionButton>
        </div>
      </ActionContainer>
    </ExerciseContainer>
  );
};

export default GuidedExercise;