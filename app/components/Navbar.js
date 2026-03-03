"use client"; 
import Link from 'next/link';
import styled from 'styled-components';

const NavContainer = styled.nav`
  position: sticky; //keeps it always on top 
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(244, 241, 234, 0.9);
  backdrop-filter: blur(8px);
`;
const NavInner = styled.div`
  max-width: 1152px; 
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const BrandLogo = styled(Link)`
  font-size: 1.875rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  font-weight: bold;
  text-decoration: none;
  color: var(--foreground); 
  // scribble effect
  background-color: var(--foreground);
  color: var(--background);
  padding: 0.25rem 0.75rem;
  border-radius: 20px 5px 15px 8px; // Irregular border
  transform: rotate(-2deg);
  display: inline-block;
  transition: transform 0.2s ease;
  &:hover {
    transform: rotate(0deg);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem; 
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(26, 26, 26, 0.6);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 9999px; // Pill shape
  transition: all 0.2s ease;
  &:hover {
    color: var(--foreground);
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
export default function Navbar() {
  return (
    <NavContainer>
      <NavInner>
        <BrandLogo href="/">ethoslog</BrandLogo>        
        <NavLinks>
          <StyledLink href="/library">Library</StyledLink>
          <StyledLink href="/lab">Insight Lab</StyledLink>
          <StyledLink href="/reflection">Board</StyledLink>
        </NavLinks>
      </NavInner>
    </NavContainer>
  );
}