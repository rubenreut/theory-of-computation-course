import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-block;
  border-bottom: 1px dashed #4CAF50;
  color: #4CAF50;
  cursor: help;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  width: 250px;
  max-width: calc(100vw - 40px);
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
  
  /* Prevent the tooltip from appearing off-screen */
  @media (max-width: 768px) {
    left: auto;
    right: 0;
    transform: none;
  }
  
  /* Triangle pointer */
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
    
    @media (max-width: 768px) {
      left: auto;
      right: 20px;
    }
  }
`;

const TooltipTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #4CAF50;
`;

const TooltipText = styled.div`
  font-size: 0.9em;
  line-height: 1.4;
`;

const MoreInfoLink = styled.div`
  margin-top: 5px;
  font-size: 0.8em;
  text-decoration: underline;
  cursor: pointer;
  color: #4CAF50;
  
  &:hover {
    color: #45a049;
  }
`;

function Tooltip({ children, term, definition, moreInfoCallback }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);
  
  // Close the tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleMoreInfo = () => {
    setShowTooltip(false);
    if (moreInfoCallback) {
      moreInfoCallback(term);
    }
  };
  
  return (
    <TooltipWrapper 
      ref={tooltipRef}
      onClick={() => setShowTooltip(!showTooltip)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      <TooltipContent show={showTooltip}>
        <TooltipTitle>{term}</TooltipTitle>
        <TooltipText>{definition}</TooltipText>
        {moreInfoCallback && (
          <MoreInfoLink onClick={handleMoreInfo}>
            See full definition in glossary
          </MoreInfoLink>
        )}
      </TooltipContent>
    </TooltipWrapper>
  );
}

export default Tooltip;