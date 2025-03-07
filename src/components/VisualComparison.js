import React from 'react';
import styled from 'styled-components';

const ComparisonContainer = styled.div`
  margin: 30px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ComparisonHeader = styled.div`
  background-color: #f5f5f5;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const ComparisonTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 18px;
`;

const ComparisonDescription = styled.p`
  color: #666;
  margin: 10px 0 0 0;
  font-size: 14px;
  line-height: 1.5;
`;

const ComparisonBody = styled.div`
  display: flex;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ComparisonColumn = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${props => props.highlight ? '#f9f9f9' : 'white'};
  border-${props => props.vertical ? 'bottom' : 'right'}: ${props => 
    props.last ? 'none' : '1px solid #e0e0e0'};
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: ${props => props.last ? 'none' : '1px solid #e0e0e0'};
  }
`;

const ColumnTitle = styled.h4`
  color: #333;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${props => props.color || '#4caf50'};
  display: flex;
  align-items: center;
`;

const ColumnIcon = styled.span`
  margin-right: 10px;
  font-size: 1.2em;
`;

const ContentList = styled.ul`
  padding-left: 20px;
  margin: 0;
  
  li {
    margin-bottom: 10px;
    line-height: 1.5;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CodeBlock = styled.pre`
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 10px 0;
  font-family: monospace;
  border-left: 3px solid ${props => props.color || '#4caf50'};
`;

const ComparisonFooter = styled.div`
  background-color: #f9f9f9;
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  font-style: italic;
  color: #666;
`;

function VisualComparison({ 
  title, 
  description, 
  columns, 
  footer,
  vertical = false 
}) {
  return (
    <ComparisonContainer>
      <ComparisonHeader>
        <ComparisonTitle>{title}</ComparisonTitle>
        {description && <ComparisonDescription>{description}</ComparisonDescription>}
      </ComparisonHeader>
      
      <ComparisonBody vertical={vertical}>
        {columns.map((column, index) => (
          <ComparisonColumn 
            key={index}
            last={index === columns.length - 1}
            vertical={vertical}
            highlight={column.highlight}
          >
            <ColumnTitle color={column.color}>
              {column.icon && <ColumnIcon>{column.icon}</ColumnIcon>}
              {column.title}
            </ColumnTitle>
            
            {column.content && typeof column.content === 'string' && (
              <p>{column.content}</p>
            )}
            
            {column.list && (
              <ContentList>
                {column.list.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ContentList>
            )}
            
            {column.code && (
              <CodeBlock color={column.color}>{column.code}</CodeBlock>
            )}
            
            {column.content && typeof column.content !== 'string' && column.content}
          </ComparisonColumn>
        ))}
      </ComparisonBody>
      
      {footer && (
        <ComparisonFooter>{footer}</ComparisonFooter>
      )}
    </ComparisonContainer>
  );
}

export default VisualComparison;