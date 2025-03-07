import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Hero = styled.div`
  text-align: center;
  margin: 40px 0;
`;

const ModuleCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const ModuleCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  }
`;

const ModuleTitle = styled.h2`
  margin-top: 0;
  color: var(--primary-color);
`;

const ModuleLinks = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SectionLink = styled(Link)`
  display: inline-block;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const StartButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  margin-top: 15px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const Home = () => {
  return (
    <HomeContainer className="home">
      <Hero>
        <h1>Theory of Computation Interactive Learning</h1>
        <p>Explore key concepts in theoretical computer science through interactive modules and visualizations.</p>
      </Hero>
      
      <ModuleCards>
        <ModuleCard>
          <ModuleTitle>Context-Free Grammars</ModuleTitle>
          <p>
            Learn about context-free grammars, their notation, and how to use them
            to define languages. Practice with interactive examples and visualizations.
          </p>
          
          <ModuleLinks>
            <SectionLink to="/cfg/introduction">Introduction</SectionLink>
            <SectionLink to="/cfg/editor">Grammar Editor</SectionLink>
            <SectionLink to="/cfg/examples">Examples</SectionLink>
            <SectionLink to="/cfg/comparisons">Comparisons</SectionLink>
          </ModuleLinks>
          
          <div style={{ marginTop: '20px' }}>
            <StartButton to="/cfg/introduction">Start Learning</StartButton>
          </div>
        </ModuleCard>
        
        {/* Additional module cards can be added here */}
        <ModuleCard>
          <ModuleTitle>Coming Soon: Automata</ModuleTitle>
          <p>
            Learn about finite automata, pushdown automata, and Turing machines.
            Understand how they relate to different classes of languages.
          </p>
          <div style={{ marginTop: '20px', opacity: 0.5 }}>
            <StartButton as="span">Coming Soon</StartButton>
          </div>
        </ModuleCard>
        
        <ModuleCard>
          <ModuleTitle>Coming Soon: Computability</ModuleTitle>
          <p>
            Explore the fundamental limits of computation, decidability, and the
            halting problem through interactive demonstrations.
          </p>
          <div style={{ marginTop: '20px', opacity: 0.5 }}>
            <StartButton as="span">Coming Soon</StartButton>
          </div>
        </ModuleCard>
      </ModuleCards>
    </HomeContainer>
  );
};

export default Home;