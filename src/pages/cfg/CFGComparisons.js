import React from 'react';
import styled from 'styled-components';
import VisualComparisons from '../../components/VisualComparisons';

const ComparisonsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const CFGComparisons = () => {
  return (
    <ComparisonsContainer>
      <h2>Grammar Comparisons</h2>
      <p>Compare different grammar types and understand the hierarchy of formal languages.</p>
      <VisualComparisons />
    </ComparisonsContainer>
  );
};

export default CFGComparisons;