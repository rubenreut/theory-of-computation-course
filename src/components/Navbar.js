import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background-color: #333;
  color: white;
  padding: 10px 0;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  color: ${props => props.active ? '#4CAF50' : 'white'};
  text-decoration: none;
  font-size: 1rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  padding: 5px 10px;
  border-bottom: ${props => props.active ? '2px solid #4CAF50' : 'none'};
  
  &:hover {
    color: #4CAF50;
  }
`;

function Navbar() {
  const location = useLocation();
  
  return (
    <NavContainer>
      <NavContent>
        <Logo>
          <StyledLink to="/" active={location.pathname === '/'}>
            Theory of Computation
          </StyledLink>
        </Logo>
        <NavLinks>
          <StyledLink 
            to="/" 
            active={location.pathname === '/'}
          >
            Home
          </StyledLink>
          <StyledLink 
            to="/cfg" 
            active={location.pathname === '/cfg'}
          >
            CFG Module
          </StyledLink>
        </NavLinks>
      </NavContent>
    </NavContainer>
  );
}

export default Navbar;