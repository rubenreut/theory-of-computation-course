import React from 'react';
import Tooltip from './Tooltip';
import tooltipDefinitions from '../utils/tooltipDefinitions';

// Helper function to escape HTML special characters
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Custom component that automatically adds tooltips to technical terms
function TooltipText({ children, moreInfoCallback }) {
  if (typeof children !== 'string') {
    return children;
  }
  
  // Get all terms we have definitions for
  const terms = Object.keys(tooltipDefinitions);
  
  // Sort terms by length (longest first) to handle cases where terms contain other terms
  const sortedTerms = terms.sort((a, b) => b.length - a.length);
  
  // Create a regex pattern to match all terms, ensuring they are whole words
  const pattern = new RegExp(`\\b(${sortedTerms.join('|')})\\b`, 'gi');
  
  // Split the text by the pattern and include the matched terms
  const parts = children.split(pattern);
  
  // Create an array of React elements, adding tooltips to matched terms
  return (
    <>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        if (terms.includes(lowerPart)) {
          return (
            <Tooltip 
              key={index} 
              term={part}
              definition={tooltipDefinitions[lowerPart]}
              moreInfoCallback={moreInfoCallback}
            >
              {part}
            </Tooltip>
          );
        }
        return part;
      })}
    </>
  );
}

export default TooltipText;