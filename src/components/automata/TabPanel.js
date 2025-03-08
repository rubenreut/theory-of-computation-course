import React from 'react';
import styled from 'styled-components';

export const TabContainer = styled.div`
  display: flex;
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
`;

export const Tab = styled.button`
  background: ${props => props.active 
    ? (props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)') 
    : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: ${props => props.active ? 'none' : '1px solid var(--border-color)'};
  padding: var(--spacing-md) var(--spacing-lg);
  margin-right: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active 
      ? (props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)') 
      : 'rgba(0, 0, 0, 0.05)'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = ({ 
  tabs = [], 
  activeTab = '', 
  onChange = () => {}, 
  variant = 'dfa' 
}) => {
  return (
    <TabContainer>
      {tabs.map(tab => (
        <Tab
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          disabled={tab.disabled}
          variant={variant}
        >
          {tab.label}
        </Tab>
      ))}
    </TabContainer>
  );
};

export default TabPanel;