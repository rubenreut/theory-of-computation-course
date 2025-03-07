import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSettings } from '../context/SettingsContext';

const WordCountContainer = styled.div`
  display: ${props => props.visible ? 'inline-flex' : 'none'};
  align-items: center;
  padding: 4px 10px;
  background-color: var(--background-color);
  border-radius: 15px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 10px;
  margin-bottom: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
  
  span {
    font-weight: 600;
    color: var(--text-color);
    margin-left: 4px;
  }
`;

const CountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>
);

// This component calculates and displays word count for any text content
const WordCount = ({ text, label = "Words" }) => {
  const { settings, countWords } = useSettings();
  const [wordCount, setWordCount] = useState(0);
  
  useEffect(() => {
    if (text) {
      setWordCount(countWords(text));
    } else {
      setWordCount(0);
    }
  }, [text, countWords]);
  
  return (
    <WordCountContainer visible={settings.enableWordCount}>
      <CountIcon />
      {label}: <span>{wordCount}</span>
    </WordCountContainer>
  );
};

export default WordCount;