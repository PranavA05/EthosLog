/* 
Page: Library Page 
Purpose: Acts as a search engine for users to find books to write their insight
This uses React states for the search bar and fetches data from Open Library API
*/

"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 2rem 1rem;
  animation: fadeIn 0.5s ease-in-out; 
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Header = styled.header`
  max-width: 600px;
  margin: 0 auto 3rem auto;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-family: 'Crimson Text', serif;
  font-style: italic;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-family: 'Geist Mono', monospace;
  font-size: 0.875rem;
  color: rgba(26, 26, 26, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  font-family: 'Geist Mono', monospace;
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Geist Mono', monospace;
  
  &:hover {
    background: #555;
  }
`;

const GridContainer = styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BookCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  border: 1px solid #e0e0e0;
  padding: 1rem;
  border-radius: 8px;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const CoverImage = styled.div`
  width: 100%;
  height: 250px;
  background: #f5f5f5;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CoverPlaceholder = styled.p`
  color: #999;
  text-align: center;
  font-size: 0.9rem;
  padding: 1rem;
  font-family: 'Crimson Text', serif;
  font-style: italic;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-family: 'Crimson Text', serif;
  margin: 0.5rem 0;
`;

const Author = styled.p`
  color: #666;
  font-size: 0.9rem;
  font-family: 'Geist Mono', monospace;
  margin: 0.5rem 0;
`;

const Category = styled.p`
  font-size: 0.8rem;
  color: #999;
  font-family: 'Geist Mono', monospace;
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-family: 'Geist Mono', monospace;
  font-size: 0.875rem;
`;

const InitialMessage = styled.p`
  font-family: 'Geist Mono', monospace;
  font-size: 0.875rem;
  color: rgba(26, 26, 26, 0.6);
`;

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError("Please enter a book title");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${searchTerm}&limit=8`
      );
      const data = await response.json();
      
      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs);
      } else {
        setError("No books found. Try a different search.");
        setBooks([]);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header>
        <PageTitle>Your Library</PageTitle>
        <Subtitle>Curating wisdom, one page at a time.</Subtitle>
        
        <form onSubmit={handleSearch}>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Type a book and press Enter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton type="submit">Search</SearchButton>
          </SearchContainer>
        </form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Header>

      <GridContainer>
        {loading && <p>Loading...</p>}
        
        {!loading && books.length === 0 && !error && (
          <InitialMessage>Search for a book to get started</InitialMessage>
        )}
        
        {books.map((book) => (
          <BookCard href={`/lab?book=${encodeURIComponent(book.title)}`} key={book.key}>
            <CoverImage>
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                />
              ) : (
                <CoverPlaceholder>{book.title}</CoverPlaceholder>
              )}
            </CoverImage>
            
            <Title>{book.title || 'Unknown'}</Title>
            <Author>
              {book.author_name ? book.author_name[0] : 'Unknown Author'}
            </Author>
            <Category>
              {book.subject ? book.subject[0] : 'General'}
            </Category>
          </BookCard>
        ))}
      </GridContainer>
    </Wrapper>
  );
}