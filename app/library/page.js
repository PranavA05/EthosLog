/* 
Page: Library Page 
Purpose: Acts as a search engine for users to find books to write their insight
This uses React states for the search bar and fetches data from Open Lirary API
! I had originally planned to use Google's API for this but got rate limited !
*/

"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';


const Wrapper = styled.div`
  padding-bottom: 5rem;
  animation: fadeIn 0.5s ease-in-out; 
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
const Header = styled.header`
  max-width: 600px;
  margin: 2rem auto 4rem auto;
  text-align: center;
`;
const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-family: 'Crimson Text', serif;
  font-style: italic;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;
const Subtitle = styled.p`
  font-family: 'Geist Mono', monospace;
  font-size: 0.875rem;
  color: rgba(26, 26, 26, 0.6); 
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;


const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 32rem;
  margin: 0 auto;
  border-bottom: 1px solid rgba(26, 26, 26, 0.2);
  padding-bottom: 0.5rem;
  
  &:hover {
    border-color: rgba(26, 26, 26, 0.8);
  }
`;
const SearchInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Geist Mono', monospace;
  font-size: 0.875rem;
  color: var(--foreground);
`;


const GridContainer = styled.main`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
  row-gap: 3.5rem;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
`;

const BookCard = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;  
  &:hover h3 {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;
const CoverImage = styled.div`
  aspect-ratio: 2 / 3;
  background-color: rgba(26, 26, 26, 0.05); 
  margin-bottom: 1rem;
  border: 1px solid rgba(26, 26, 26, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;  
  ${BookCard}:hover & {
    transform: translateY(-6px);
  }
`;
const CoverText = styled.span`
  font-family: 'Crimson Text', serif;
  font-style: italic;
  color: rgba(26, 26, 26, 0.4);
  text-align: center;
  padding: 0 1rem;
`;
const Title = styled.h3`
  font-size: 1.125rem;
  font-family: 'Crimson Text', serif;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;
const Author = styled.p`
  font-size: 0.75rem;
  color: rgba(26, 26, 26, 0.6);
  font-family: 'Geist Mono', monospace;
  margin-bottom: 0.75rem;
`;
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(26, 26, 26, 0.1);
`;
const CategoryTag = styled.span`
  font-size: 0.5625rem;
  text-transform: uppercase;
  font-family: 'Geist Mono', monospace;
  color: rgba(26, 26, 26, 0.6);
  background-color: rgba(26, 26, 26, 0.04);
  padding: 0.25rem 0.5rem;
`;
const InsightCount = styled.p`
  font-size: 0.5625rem;
  text-transform: uppercase;
  font-family: 'Geist Mono', monospace;
  color: rgba(26, 26, 26, 0.5);
`;



const AddEntryCard = styled(Link)`
  aspect-ratio: 2 / 3;
  border: 1px dashed rgba(26, 26, 26, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(26, 26, 26, 0.4);
  text-decoration: none;
  transition: all 0.3s ease;
  &:hover {
    border-color: rgba(26, 26, 26, 0.5);
    color: rgba(26, 26, 26, 0.7);
  }
`;
const AddIcon = styled.span`
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
`;
const AddText = styled.p`
  font-size: 0.625rem;
  text-transform: uppercase;
  font-family: 'Geist Mono', monospace;
  margin-top: 0.5rem;
`;


export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [Books, setBooks] = useState([]);
  const [searching, setSearching] = useState(false);
  // API; Open Library 
  const searchBooks = async (e) => {
    e.preventDefault(); 
    if(!searchTerm) return;
    setSearching(true); 
    try {
      //  had to switch to Open Library API as was getting limited by Google API
      const response = await fetch(`https://openlibrary.org/search.json?q=${searchTerm}&limit=8`);
      const data = await response.json();
      //data returned in a array , docs
      if (data.docs) { 
        setBooks(data.docs);
      } else {
        setBooks([]); 
      } 
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setSearching(false);
    }
  };


  return (
    <Wrapper>
      <Header>
        <PageTitle>Your Library</PageTitle>
        <Subtitle>Curating wisdom, one page at a time.</Subtitle>
        <form onSubmit={searchBooks}>
          <SearchContainer>
            <SearchInput
              type="text" 
              placeholder="Type a book and press Enter..."
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </form>
      </Header>     
      <GridContainer>
        {searching ? (
          <p>Searching open libraries...</p>
        ) : (
          Books.map((book) => {
            const title = book.title || 'Unknown Title';
            const author = book.author_name ? book.author_name[0] : 'Unknown Author';
            const coverImage = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null;
            const category = book.subject ? book.subject[0] : 'General';          
            return (
              <BookCard href={"/lab"} key={book.key || title}>
                <CoverImage>
                  {coverImage ? (<img src={coverImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : ( 
                    <CoverText>{title}</CoverText> 
                  )}
                </CoverImage>           
                <Title>{title}</Title>
                <Author>{author}</Author>
                <CardFooter>
                  <CategoryTag>{category}</CategoryTag>
                  <InsightCount>API Data</InsightCount>
                </CardFooter>
              </BookCard>
            );
          })
        )}
        <AddEntryCard href="/lab">
          <AddIcon>+</AddIcon>
          <AddText>Log New Insight</AddText>
        </AddEntryCard>
      </GridContainer>
    </Wrapper>
  );
}