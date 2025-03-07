import React, { useState } from 'react';
import styled from 'styled-components';

const GlossaryItemContainer = styled.div`
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const GlossaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: ${props => props.expanded ? '#f5f5f5' : 'white'};
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TermContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Term = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const Category = styled.span`
  margin-left: 10px;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  background-color: #e3f2fd;
  color: #1565c0;
`;

const ChevronIcon = styled.span`
  transition: transform 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DefinitionContainer = styled.div`
  padding: ${props => props.expanded ? '15px' : '0 15px'};
  max-height: ${props => props.expanded ? '2000px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  background-color: #fafafa;
`;

const Definition = styled.div`
  line-height: 1.5;
  color: #444;
`;

const ExampleSection = styled.div`
  margin-top: 10px;
  background-color: #f1f8e9;
  padding: 10px;
  border-left: 3px solid #7cb342;
  border-radius: 4px;
`;

const ExampleHeading = styled.h4`
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #33691e;
`;

const CodeBlock = styled.pre`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  overflow-x: auto;
  margin: 10px 0;
`;

const RelatedTermsSection = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const RelatedTermLabel = styled.span`
  font-weight: 600;
  margin-right: 5px;
`;

const RelatedTerm = styled.span`
  font-size: 13px;
  background-color: #e8eaf6;
  color: #3d5afe;
  padding: 3px 8px;
  border-radius: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #c5cae9;
  }
`;

function GlossaryItem({ term, definition, examples, category, relatedTerms, onRelatedTermClick }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <GlossaryItemContainer>
      <GlossaryHeader 
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}
      >
        <TermContainer>
          <Term>{term}</Term>
          {category && <Category>{category}</Category>}
        </TermContainer>
        <ChevronIcon expanded={expanded}>▼</ChevronIcon>
      </GlossaryHeader>
      
      <DefinitionContainer expanded={expanded}>
        <Definition dangerouslySetInnerHTML={{ __html: definition }} />
        
        {examples && examples.length > 0 && (
          <ExampleSection>
            <ExampleHeading>Examples:</ExampleHeading>
            {examples.map((example, index) => (
              <div key={index}>
                {example.text && <p>{example.text}</p>}
                {example.code && (
                  <CodeBlock>{example.code}</CodeBlock>
                )}
              </div>
            ))}
          </ExampleSection>
        )}
        
        {relatedTerms && relatedTerms.length > 0 && (
          <RelatedTermsSection>
            <RelatedTermLabel>Related terms:</RelatedTermLabel>
            {relatedTerms.map((relatedTerm, index) => (
              <RelatedTerm 
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onRelatedTermClick(relatedTerm);
                }}
              >
                {relatedTerm}
              </RelatedTerm>
            ))}
          </RelatedTermsSection>
        )}
      </DefinitionContainer>
    </GlossaryItemContainer>
  );
}

export default GlossaryItem;