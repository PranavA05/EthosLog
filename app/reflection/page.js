"use client";
/*
PAGE: Reflection Page
PURPOSE: This page reads and displays all the user's saved insights from the database.
It uses a useEffect hook to fetch documents from Firebase Firestore exactly once when the page loads.
*/

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../auth/firebase';
import { collection, getDocs } from 'firebase/firestore';

const PageWrapper = styled.div` 
  max-width: 64rem;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 5rem;
  animation: fadeIn 0.5s ease-in-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(26, 26, 26, 0.1);
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

// Logic for the board's layout
const MasonryGrid = styled.main`
  column-count: 1;
  column-gap: 1.5rem;
  @media (min-width: 768px) { column-count: 2; }
  @media (min-width: 1024px) { column-count: 3; }
`;
const ArticleCard = styled.article`
  break-inside: avoid; // Prevents cards from splitting
  margin-bottom: 1.5rem;
  background-color: #FFFFFF;
  padding: 2rem;
  border: 1px solid rgba(26, 26, 26, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;
const Tag = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.5;
  background-color: var(--background);
  border: 1px solid rgba(26, 26, 26, 0.05);
  padding: 0.25rem 0.5rem;
`;
const DateText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.4;
`;
const ReflectionText = styled.p`
  font-family: 'Georgia', serif;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--foreground);
  margin-bottom: 2rem;
`;
const CardFooter = styled.div`
  padding-top: 1rem;
  border-top: 1px solid rgba(26, 26, 26, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BookTitle = styled.p`
  font-family: 'Georgia', serif;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  ${ArticleCard}:hover & {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: rgba(26, 26, 26, 0.2);
  }
`;
const BookAuthor = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  opacity: 0.6;
  margin-top: 0.25rem;
`;

export default function ReflectionBoardPage() {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const query = await getDocs(collection(db, "reflections"));
        const fetchedData = [];
        query.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });
        setInsights(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, []); // [] needed to run once

  return (
    <PageWrapper>
      <HeaderContainer>
        <div>
          <Title>Reflection Board</Title>
        </div>
      </HeaderContainer>
      {isLoading ? (
        <p>Loading your insights..</p>
      ) : (
        <MasonryGrid>
          {insights.map((item) => (
            <ArticleCard key={item.id}>
              <CardHeader>
                <Tag>#{item.tag}</Tag>
                <DateText>{item.date}</DateText>
              </CardHeader>
              <ReflectionText>"{item.insight}"</ReflectionText>
              <CardFooter>
                <div>
                  <BookTitle>{item.book}</BookTitle>
                  <BookAuthor>Note:</BookAuthor>
                </div>
              </CardFooter>
            </ArticleCard>
          ))}
        </MasonryGrid>
      )}
    </PageWrapper>
  );
}