import React from 'react';
import Explanation from '../../components/Explanation';
import styled from 'styled-components';

const IntroductionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CFGIntroduction = () => {
  return (
    <IntroductionContainer>
      <h2>Introduction to Context-Free Grammars</h2>
      <Explanation />
    </IntroductionContainer>
  );
};

export default CFGIntroduction;