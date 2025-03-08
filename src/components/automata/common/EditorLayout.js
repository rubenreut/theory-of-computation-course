import React from 'react';
import styled from 'styled-components';
import TabPanel from '../TabPanel';

// Reusable styled components for the editor layout
export const EditorContainer = styled.div`
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
`;

export const SectionTitle = styled.h2`
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
  color: ${props => props.variant === 'nfa' ? 'var(--tertiary-color)' : 'var(--secondary-color)'};
`;

export const SectionDescription = styled.p`
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xl);
  color: var(--text-secondary);
  line-height: 1.6;
`;

export const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xxl);
`;

/**
 * EditorLayout component
 * 
 * A reusable layout component for automata editors that provides
 * consistent structure, tabs, and content areas.
 * 
 * @param {Object} props Component props
 * @param {string} props.title The title of the editor
 * @param {string} props.description A description of the automaton type
 * @param {string} props.variant The variant of the automaton ('dfa' or 'nfa')
 * @param {Array} props.tabs Array of tab objects {id, label, disabled}
 * @param {string} props.activeTab The currently active tab ID
 * @param {Function} props.onTabChange Callback when tab is changed
 * @param {React.ReactNode} props.definitionContent Content for the definition tab
 * @param {React.ReactNode} props.visualizationContent Content for the visualization tab
 * @param {React.ReactNode} props.simulationContent Content for the simulation tab
 */
const EditorLayout = ({
  title,
  description,
  variant = 'dfa',
  tabs,
  activeTab,
  onTabChange,
  definitionContent,
  visualizationContent,
  simulationContent
}) => {
  return (
    <EditorContainer>
      <SectionTitle variant={variant}>{title}</SectionTitle>
      <SectionDescription>{description}</SectionDescription>
      
      <MainLayout>
        <TabPanel 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={onTabChange} 
          variant={variant}
        />
        
        {activeTab === 'definition' && definitionContent}
        {activeTab === 'visualization' && visualizationContent}
        {activeTab === 'simulation' && simulationContent}
      </MainLayout>
    </EditorContainer>
  );
};

export default EditorLayout;