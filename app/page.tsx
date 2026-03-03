"use client";
/* First page where user land and can sign in/ sign up and then move on to the library */
import Link from "next/link";
import styled from "styled-components";

//Flexbox to center everything 
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
`;
const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 42rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.75rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  margin-bottom: 1.5rem;
  letter-spacing: -0.05em;
  @media (min-width: 768px) {
    font-size: 6rem;
  }
`;

//The "Scribble" Effect using CSS border-radius and transform
const ScribbleText = styled.span`
  background-color: var(--foreground);
  color: var(--background);
  padding: 0.5rem 1.5rem;
  border-radius: 25px 8px 30px 12px; // Uneven corners create the marker look 
  transform: rotate(-2deg); // Slight tilt 
  display: inline-block;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  font-family: 'Georgia', serif;
  line-height: 1.75;
  opacity: 0.8;
  margin-bottom: 3rem;
  max-width: 28rem;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  @media (min-width: 640px) {
    flex-direction: row;
    width: auto;
  }
`;

const PrimaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  background-color: var(--foreground);
  color: var(--background);
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.8;
  }
`;
const SecondaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.5rem;
  background-color: transparent;
  color: var(--foreground);
  border: 1px solid rgba(26, 26, 26, 0.2);
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  text-decoration: none;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

// First Page Users see
export default function Home() {
  return (
    <PageContainer>
      <MainContent>
        <Title>
          <ScribbleText>ethoslog</ScribbleText>
        </Title>
        <Subtitle>
          Capture, categorize, and reflect on your insights from the books you read.
        </Subtitle>       
        <ButtonGroup>
          <PrimaryButton href="/library">
            Enter Library
          </PrimaryButton>      
          <SecondaryButton href="/auth">
            Sign In / Sign Up
          </SecondaryButton>
        </ButtonGroup>
      </MainContent>
    </PageContainer>
  );
}
