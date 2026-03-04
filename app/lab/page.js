/*
Page: Insight Lab Page 
Purpose: lets users record insights and save them. The form inputs handled by React state 
while connecting to Firebase DB which is the location to save the "reflections".
*/

"use client";
import {useState, useEffect} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import {db} from '../auth/firebase';
import {collection, addDoc} from 'firebase/firestore';

const PageWrapper = styled.div`
  width: 64rem;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(26, 26, 26, 0.1);
`;
const Title = styled.h1`
  font-size: 2.25rem;
  font-family: 'Crimson Text', serif;
  font-style: italic;
  margin-bottom: 0.5rem;
`;
const Subtitle = styled.p`
  font-family: 'Geist Mono', monospace;
  font-size: 0.75rem;
  color: rgba(26, 26, 26, 0.6);
  opacity: 0.6;
  text-transform: uppercase;
`;
const BackLink = styled(Link)`
  font-family: 'Geist Mono', monospace;
  font-size: 0.625rem;
  text-decoration: none;
  color: var(--foreground);
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

const QuoteSideBar = styled.div`
  padding: 2rem;
  background-color: rgba(26, 26, 26, 0.03);
  border: 1px solid rgba(26, 26, 26, 0.1);
  border-left: 4px solid var(--foreground);
  margin-bottom: 2rem;
`;
const Quote = styled.blockquote`
  font-family: 'Crimson Text', serif;
  font-style: italic;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;
const QuoteAuthor = styled.p`
  font-family: 'Geist Mono', monospace;
  font-size: 0.75rem;
  opacity: 0.7;
`;

const InputSection = styled.div`
  background-color: #FFFFFF;
  padding: 2.5rem;
  border: 1px solid rgba(26, 26, 26, 0.1);
`;
const BookTitleInput = styled.input`
  font-size: 1.5rem;
  font-family: 'Crimson Text', serif;
  font-style: italic;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground);
  margin-bottom: 2rem;
  width: 100%;
  &::placeholder {
    opacity: 0.3;
  }
`;

const InsightTextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  font-size: 1rem;
  line-height: 1.8;
  font-family: 'Crimson Text', serif;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground);
  resize: vertical; 
  &::placeholder {
    opacity: 0.3;
  }
`;

const FooterRow = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(26, 26, 26, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TagInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HashSymbol = styled.span`
  font-size: 0.875rem;
  opacity: 0.4;
`;

const TagInput = styled.input`
  font-size: 0.75rem;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground); 
  &::placeholder {
    opacity: 0.4;
  }
`;

const SaveButton = styled.button`
  background-color: var(--foreground);
  color: var(--background);
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-family: 'Geist Mono', monospace;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

export default function InsightLabPage() {
  const searchParams = useSearchParams();
  // form 
  const [bookTitle, setBookTitle] = useState("");
  const [insight, setInsight] = useState("");
  const [tag, setTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // quote 
  const [quote, setQuote] = useState("Loading...");
  const [author, setAuthor] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(true);

  // fetch random quote every time the page loads
  useEffect(() => {
    fetchQuote();
  }, []);

  // check if book selected from library
  useEffect(() => {
    const bookParam = searchParams.get('book');
    if (bookParam) {
      setBookTitle(decodeURIComponent(bookParam));
    }
  }, [searchParams]);


  // API for quotes , randomly selects a quote to show the user 
  const fetchQuote = async () => {
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      const data = await response.json();
      setQuote(data.quote);
      setAuthor(data.author);
      setQuoteLoading(false);
    } catch (err) {
      console.error("Failed to load quote:", err);
      // if err, base quote
      setQuote("The only way to do great work is to love what you do.");
      setAuthor("Steve Jobs");
      setQuoteLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // validation
    if (!bookTitle.trim()) {
      setError("Please enter a book title");
      return;
    }
    if (!insight.trim()) {
      setError("Please write an insight");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      // save to firebase
      await addDoc(collection(db, "reflections"), {
        book: bookTitle,
        insight: insight,
        tag: tag || "general",
        date: new Date().toLocaleDateString(),
      });
      // clear form after saving
      setBookTitle("");
      setInsight("");
      setTag("");
      alert("Saved!");
    } catch (error) {
      console.error("Error saving:", error);
      setError("Failed to save. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <div>
          <Title>Insight Lab</Title>
          <Subtitle>Write your thoughts here</Subtitle>
        </div>
        <BackLink href="/library">&larr; Back</BackLink>
      </Header>

      <QuoteSideBar>
        {quoteLoading ? (
          <p>Loading quote...</p>
        ) : (
          <>
            <Quote>"{quote}"</Quote>
            <QuoteAuthor>— {author}</QuoteAuthor>
          </>
        )}
      </QuoteSideBar>

      <form onSubmit={handleSave}>
        <InputSection>
          <BookTitleInput
            type="text"
            placeholder="Book title..."
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <InsightTextArea
            placeholder="What did you learn? How does it apply to you?"
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
          />
          <FooterRow>
            <TagInputWrapper>
              <HashSymbol>#</HashSymbol>
              <TagInput
                type="text"
                placeholder="tag (optional)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </TagInputWrapper>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <SaveButton type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </SaveButton>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </div>
          </FooterRow>
        </InputSection>
      </form>
    </PageWrapper>
  );
}