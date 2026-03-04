"use client";
/*
Page: Reflection Page
Purpose: Display all saved insights/reflections from Firestore
Shows them in a masonry-style grid
*/

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../auth/firebase';
import { collection, getDocs } from 'firebase/firestore';

const PageWrapper = styled.div` 
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  padding-bottom: 5rem;
  animation: fadeIn 0.5s ease-in-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PageHeader = styled.header`
  margin-bottom: 3.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(26, 26, 26, 0.1);
`;

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  margin: 0;
`;

const InsightsContainer = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.article`
  background-color: #FFFFFF;
  padding: 1.5rem;
  border: 1px solid rgba(26, 26, 26, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;
const Tag = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  text-transform: uppercase;
  opacity: 0.6;
  background-color: rgba(26, 26, 26, 0.05);
  border: 1px solid rgba(26, 26, 26, 0.08);
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
`;
const DateLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  text-transform: uppercase;
  opacity: 0.5;
  white-space: nowrap;
`;
const InsightQuote = styled.p`
  font-family: 'Georgia', serif;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--foreground);
  margin: 0 0 1.5rem 0;
  font-style: italic;
`;
const CardFooter = styled.div`
  padding-top: 1rem;
  border-top: 1px solid rgba(26, 26, 26, 0.05);
`;
const BookTitle = styled.p`
  font-family: 'Georgia', serif;
  font-weight: 500;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
`;
const BookAuthor = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  opacity: 0.6;
  margin: 0;
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: rgba(26, 26, 26, 0.6);
`;

const EmptyMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: rgba(26, 26, 26, 0.6);
`;

export default function ReflectionBoardPage() {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  //fetches insights from reflections collection 
  const loadInsights = async () => {
    try {
      const query = await getDocs(collection(db, "reflections"));
      const fetchedInsights = [];
      
      query.forEach((doc) => {
        fetchedInsights.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setInsights(fetchedInsights);
    } catch (error) {
      console.error("Error loading insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Reflection Board</PageTitle>
      </PageHeader>
      {isLoading ? (
        <LoadingMessage>Loading your insights...</LoadingMessage>
      ) : insights.length > 0 ? (
        <InsightsContainer>
          {insights.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <Tag>#{item.tag || 'general'}</Tag>
                <DateLabel>{item.date}</DateLabel>
              </CardHeader>
              <InsightQuote>"{item.insight}"</InsightQuote>
              <CardFooter>
                <BookTitle>{item.book}</BookTitle>
                <BookAuthor>From: {item.author || 'Unknown Author'}</BookAuthor>
              </CardFooter>
            </Card>
          ))}
        </InsightsContainer>
      ) : (
        <EmptyMessage>No insights yet. Start writing in the Insight Lab!</EmptyMessage>
      )}
    </PageWrapper>
  );
}