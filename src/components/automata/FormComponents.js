import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Form and input components
export const Form = styled.form`
  display: grid;
  gap: var(--spacing-xl);
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
`;

export const Input = styled.input`
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
    box-shadow: 0 0 0 4px ${props => props.variant === 'nfa' 
      ? 'rgba(94, 92, 230, 0.2)' 
      : 'rgba(52, 199, 89, 0.2)'};
  }
`;

export const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Transition table components
export const TransitionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-md);
  
  th, td {
    padding: var(--spacing-md);
    text-align: center;
    border: 1px solid var(--border-color);
  }
  
  th {
    background-color: var(--background-color);
    font-weight: 600;
  }
  
  select {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-base);
  }
`;

export const TransitionSelect = ({ 
  value, 
  options, 
  onChange, 
  variant = 'dfa' 
}) => (
  <select 
    value={value || ''}
    onChange={onChange}
    style={{ 
      borderColor: variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)',
      padding: 'var(--spacing-sm)',
      borderRadius: 'var(--border-radius-sm)',
      fontSize: 'var(--font-size-base)'
    }}
  >
    {options.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
  }
`;

// Test input components
export const TestInputContainer = styled.div`
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
`;

export const InputContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  align-items: center;
`;

export const TestInput = styled.input`
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
    box-shadow: 0 0 0 4px ${props => props.variant === 'nfa' 
      ? 'rgba(94, 92, 230, 0.2)' 
      : 'rgba(52, 199, 89, 0.2)'};
  }
`;

export const TestResult = styled.div`
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  background-color: ${props => props.accepted ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)'};
  border: 2px solid ${props => props.accepted ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)'};
  color: ${props => props.accepted ? 'var(--success-color)' : 'var(--danger-color)'};
  font-weight: 600;
  font-size: var(--font-size-lg);
  display: ${props => props.visible ? 'block' : 'none'};
  animation: ${fadeIn} 0.3s ease-out;
`;

// Panel components
export const Panel = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 20px var(--shadow-color);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  animation: ${fadeIn} 0.5s ease-out;
`;

export const VisualizationPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 700px;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
`;

export const PanelTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
`;

// Editor container components
export const EditorContainer = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
  margin-bottom: var(--spacing-xxl);
`;

export const SectionTitle = styled.h2`
  font-size: var(--font-size-xxl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60%;
    height: 4px;
    background: linear-gradient(90deg, 
      ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'}, 
      transparent);
    border-radius: 2px;
  }
`;

export const SectionDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-lg);
  line-height: 1.7;
  max-width: 800px;
`;

export const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
`;