import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0;
  transition: all 0.3s ease;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-xl);
  height: 60px;
  
  @media (min-width: 1800px) {
    padding: 0 var(--spacing-xxl);
  }
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-md);
  }
`;

const Logo = styled(Link)`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LogoIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: linear-gradient(135deg, var(--primary-color), var(--tertiary-color));
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: var(--spacing-md);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StyledLink = styled(Link)`
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-color)'};
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s ease;
  background-color: ${props => props.active ? 'rgba(0, 113, 227, 0.1)' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(0, 113, 227, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
    width: 100%;
    text-align: center;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  
  @media (max-width: 768px) {
    display: block;
  }
`;

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Check if current path starts with a specific route
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <NavContainer>
      <NavContent>
        <Logo to="/">
          <LogoIcon>T</LogoIcon>
          <span>Theory of Computation</span>
        </Logo>
        
        <HamburgerButton onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </HamburgerButton>
        
        <NavLinks isOpen={isOpen}>
          <StyledLink 
            to="/" 
            active={isActive('/')}
            onClick={() => setIsOpen(false)}
          >
            Home
          </StyledLink>
          <StyledLink 
            to="/cfg" 
            active={isActive('/cfg')}
            onClick={() => setIsOpen(false)}
          >
            Context-Free Grammars
          </StyledLink>
          <StyledLink 
            to="/automata" 
            active={isActive('/automata')}
            onClick={() => setIsOpen(false)}
          >
            Finite Automata
          </StyledLink>
          {/* Add more links as needed */}
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
}

export default Navbar;