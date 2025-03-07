import React, { useState } from 'react';
import styled from 'styled-components';
import GrammarEditor from '../../components/GrammarEditor';
import DerivationTree from '../../components/DerivationTree';
import Parser from '../../components/Parser';

const EditorContainer = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-heading);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
  letter-spacing: -0.01em;
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xxl);
  font-size: var(--font-size-xl);
  line-height: 1.6;
  max-width: 850px;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  font-size: var(--font-size-lg);
  
  /* Make any inputs, textareas, etc. larger */
  & input, & textarea, & select, & button {
    font-size: var(--font-size-lg);
    padding: 12px 16px;
  }
  
  /* Make sure code and pre elements are larger and more readable */
  & code, & pre {
    font-size: var(--font-size-base);
    line-height: 1.6;
  }
  
  /* Ensure all text content is properly sized */
  & p, & li, & div {
    font-size: var(--font-size-lg);
    line-height: 1.6;
  }
`;

const PanelTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-color);
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: var(--primary-color);
    border-radius: 50%;
    margin-right: 12px;
  }
`;

const ShareSection = styled.div`
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-lg);
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
`;

const ShareButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 113, 227, 0.3);
  
  &:hover {
    background-color: #0062c9;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 113, 227, 0.4);
  }
  
  &::before {
    content: '↗';
    margin-right: 8px;
    font-size: 1.1rem;
  }
`;

const ShareURL = styled.div`
  margin-top: var(--spacing-md);
  background-color: white;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const URLInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.02);
  font-family: 'SF Mono', SFMono-Regular, Consolas, monospace;
  font-size: 0.9rem;
  margin-top: var(--spacing-sm);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2);
  }
`;

const CopyStatus = styled.span`
  color: var(--secondary-color);
  font-size: 0.9rem;
  margin-left: var(--spacing-sm);
  font-weight: 500;
`;

const CFGEditor = ({ grammar, setGrammar, inputString, setInputString, createShareableURL }) => {
  const [shareURL, setShareURL] = useState('');
  const [showShareURL, setShowShareURL] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  
  const handleShare = () => {
    const url = createShareableURL(grammar, inputString);
    setShareURL(url);
    setShowShareURL(true);
    
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopyStatus('Copied to clipboard!');
        setTimeout(() => setCopyStatus(''), 3000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
        setCopyStatus('Failed to copy');
      });
  };

  return (
    <EditorContainer>
      <SectionTitle>Grammar Editor</SectionTitle>
      <SectionDescription>
        Create and test your own context-free grammar using the interactive editor below.
        Define productions, test input strings, and visualize derivation trees.
      </SectionDescription>
      
      <TwoColumnLayout>
        <Panel>
          <PanelTitle>Grammar Definition</PanelTitle>
          <GrammarEditor grammar={grammar} setGrammar={setGrammar} />
        </Panel>
        
        <Panel>
          <PanelTitle>Derivation Tree</PanelTitle>
          <DerivationTree grammar={grammar} inputString={inputString} />
        </Panel>
      </TwoColumnLayout>
      
      <Panel>
        <PanelTitle>Input String Parser</PanelTitle>
        <Parser 
          grammar={grammar} 
          inputString={inputString} 
          setInputString={setInputString} 
        />
      </Panel>
      
      <ShareSection>
        <PanelTitle>Share Your Grammar</PanelTitle>
        <p>Share your grammar and input string with others via a URL. They'll be able to see and modify your grammar.</p>
        
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
          <ShareButton onClick={handleShare}>
            Generate Shareable Link
          </ShareButton>
          {copyStatus && <CopyStatus>{copyStatus}</CopyStatus>}
        </div>
        
        {showShareURL && (
          <ShareURL>
            <p>Anyone with this link can view and edit your grammar:</p>
            <URLInput 
              type="text" 
              value={shareURL} 
              readOnly 
              onClick={(e) => e.target.select()}
            />
          </ShareURL>
        )}
      </ShareSection>
    </EditorContainer>
  );
};

export default CFGEditor;