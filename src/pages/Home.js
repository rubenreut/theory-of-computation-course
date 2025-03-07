import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  width: 100%;
`;

const Hero = styled.div`
  text-align: center;
  margin: 0 auto var(--spacing-xxl);
  max-width: 800px;
  padding: var(--spacing-xxl) 0;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary-color), var(--tertiary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: var(--font-size-xl);
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ModuleCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  width: 100%;
`;

const ModuleCard = styled.div`
  background: var(--card-background);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 10px 40px var(--shadow-color);
  padding: var(--spacing-xxl);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-xl);
  }
`;

const ModuleTitle = styled.h2`
  margin-top: 0;
  margin-bottom: var(--spacing-md);
  color: var(--text-color);
  font-size: var(--font-size-xxl);
  font-weight: 700;
  
  &::before {
    content: '';
    display: block;
    width: 50px;
    height: 5px;
    background: ${props => props.coming ? 'var(--text-secondary)' : 'var(--primary-color)'};
    margin-bottom: var(--spacing-md);
    border-radius: 3px;
    opacity: ${props => props.coming ? '0.5' : '1'};
  }
`;

const ModuleDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--spacing-xl);
  flex-grow: 1;
  font-size: var(--font-size-lg);
`;

const ModuleLinks = styled.div`
  margin-bottom: var(--spacing-xl);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const SectionLink = styled(Link)`
  display: inline-block;
  background-color: rgba(0, 113, 227, 0.1);
  color: var(--primary-color);
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 25px;
  font-size: var(--font-size-base);
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 113, 227, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StartButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.coming ? 'transparent' : 'var(--primary-color)'};
  color: ${props => props.coming ? 'var(--text-secondary)' : 'white'};
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 30px;
  font-weight: 600;
  font-size: var(--font-size-lg);
  transition: all 0.2s ease;
  box-shadow: ${props => props.coming ? 'none' : '0 6px 15px rgba(0, 113, 227, 0.3)'};
  border: ${props => props.coming ? '1px solid var(--text-secondary)' : 'none'};
  opacity: ${props => props.coming ? '0.6' : '1'};
  
  &:hover {
    background-color: ${props => props.coming ? 'transparent' : '#0062c9'};
    transform: ${props => props.coming ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.coming ? 'none' : '0 8px 20px rgba(0, 113, 227, 0.4)'};
  }
  
  &::after {
    content: ${props => props.coming ? "none" : "'→'"};
    margin-left: 10px;
    font-size: 1.2em;
    transition: transform 0.2s ease;
  }
  
  &:hover::after {
    transform: translateX(5px);
  }
`;

const Home = () => {
  return (
    <HomeContainer className="home">
      <Hero>
        <HeroTitle>Theory of Computation</HeroTitle>
        <HeroSubtitle>
          Explore the foundational concepts of theoretical computer science through 
          interactive modules, visualizations, and hands-on examples.
        </HeroSubtitle>
      </Hero>
      
      <ModuleCards>
        <ModuleCard>
          <ModuleTitle>Context-Free Grammars</ModuleTitle>
          <ModuleDescription>
            Learn about context-free grammars, their notation, and how to use them
            to define languages. Practice with interactive examples and see how grammars
            relate to language hierarchies.
          </ModuleDescription>
          
          <ModuleLinks>
            <SectionLink to="/cfg/introduction">Introduction</SectionLink>
            <SectionLink to="/cfg/editor">Grammar Editor</SectionLink>
            <SectionLink to="/cfg/examples">Examples</SectionLink>
            <SectionLink to="/cfg/comparisons">Comparisons</SectionLink>
          </ModuleLinks>
          
          <StartButton to="/cfg/introduction">Start Learning</StartButton>
        </ModuleCard>
        
        <ModuleCard>
          <ModuleTitle>Finite Automata</ModuleTitle>
          <ModuleDescription>
            Explore Deterministic (DFA) and Non-deterministic (NFA) Finite Automata.
            Learn how they recognize regular languages and their relationship to regular expressions.
          </ModuleDescription>
          
          <ModuleLinks>
            <SectionLink to="/automata/introduction">Introduction</SectionLink>
            <SectionLink to="/automata/dfa">DFA Editor</SectionLink>
            <SectionLink to="/automata/nfa">NFA Editor</SectionLink>
            <SectionLink to="/automata/examples">Examples</SectionLink>
          </ModuleLinks>
          
          <StartButton to="/automata/introduction">Start Learning</StartButton>
        </ModuleCard>
        
        <ModuleCard>
          <ModuleTitle coming={true}>Computability Theory</ModuleTitle>
          <ModuleDescription>
            Explore the fundamental limits of computation, decidability, the
            halting problem, and reduction techniques through interactive demonstrations
            and accessible explanations.
          </ModuleDescription>
          
          <StartButton as="span" coming={true}>Coming Soon</StartButton>
        </ModuleCard>
      </ModuleCards>
    </HomeContainer>
  );
};

export default Home;