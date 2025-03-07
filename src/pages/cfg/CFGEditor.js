import React, { useState } from 'react';
import styled from 'styled-components';
import GrammarEditor from '../../components/GrammarEditor';
import DerivationTree from '../../components/DerivationTree';
import Parser from '../../components/Parser';

const EditorContainer = styled.div`
  margin-bottom: 30px;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ShareSection = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
`;

const ShareButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  font-weight: 500;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const CFGEditor = ({ grammar, setGrammar, inputString, setInputString, createShareableURL }) => {
  const [shareURL, setShareURL] = useState('');
  const [showShareURL, setShowShareURL] = useState(false);
  
  const handleShare = () => {
    const url = createShareableURL(grammar, inputString);
    setShareURL(url);
    setShowShareURL(true);
    
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  return (
    <EditorContainer>
      <h2>Grammar Editor</h2>
      <p>Create and test your own context-free grammar using the editor below.</p>
      
      <TwoColumnLayout>
        <GrammarEditor grammar={grammar} setGrammar={setGrammar} />
        <DerivationTree grammar={grammar} inputString={inputString} />
      </TwoColumnLayout>
      
      <Parser 
        grammar={grammar} 
        inputString={inputString} 
        setInputString={setInputString} 
      />
      
      <ShareSection>
        <h3>Share Your Grammar</h3>
        <p>Share your grammar and input string with others via a URL.</p>
        <ShareButton onClick={handleShare}>
          Generate Shareable Link
        </ShareButton>
        {showShareURL && (
          <div style={{ marginTop: '15px' }}>
            <p>Share URL (copied to clipboard):</p>
            <input 
              type="text" 
              value={shareURL} 
              readOnly 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
        )}
      </ShareSection>
    </EditorContainer>
  );
};

export default CFGEditor;