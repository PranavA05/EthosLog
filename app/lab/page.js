/*
Page :Insight Lab Page 
Purpose: lets users record insights and save them. The form inputs are handled by React state while connecting to Firebase DB
which is the location to save the "reflections".
*/

"use client";
import {useState, useEffect} from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import {db} from '../auth/firebase';
import {collection, addDoc} from 'firebase/firestore';

const PageWrapper = styled.div`
  width: 72rem;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
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
  font-family: 'Georgia', serif;
  font-style: italic;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
`;
const Subtitle = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;
const BackLink = styled(Link)`
  font-family: 'Inter', sans-serif;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--foreground);
  opacity: 0.5;
  text-decoration: none;
  transition: opacity 0.2s ease;
  &:hover { opacity: 1;}
`;

const CentralColumn = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem; 
  @media (min-width: 1024px) {
  flex-direction: row;
  align-items: flex-start;}
`;
const QuoteBanner = styled.div`
  padding: 2rem;
  background-color: rgba(26, 26, 26, 0.03);
  border: 1px solid rgba(26, 26, 26, 0.1);
  border-left: 4px solid var(--foreground);
`;
const CardLabel = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.5625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.5;
  margin-bottom: 1rem;
`;
const Quote = styled.blockquote`
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;
const QuoteAuthor = styled.cite`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  opacity: 0.7;
`;
const Canvas = styled.div`
  background-color: #FFFFFF;
  padding: 2.5rem;
  border: 1px solid rgba(26, 26, 26, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-height: 500px;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 3.5rem;}
`;
const BookInput = styled.input`
  font-size: 1.5rem;
  font-family: 'Georgia', serif;
  font-style: italic;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground);
  margin-bottom: 1.5rem;

  @media (min-width: 768px) { font-size: 1.875rem;}
  &::placeholder { opacity: 0.3;}
`;
const TextArea = styled.textarea`
  flex-grow: 1;
  font-size: 1.125rem;
  line-height: 2;
  font-family: 'Georgia', serif;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: var(--foreground);
  @media (min-width: 768px) {font-size: 1.25rem; }
  &::placeholder { opacity: 0.3;}
`;
const CanvasFooter = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(26, 26, 26, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 640px){
    flex-direction: row;
    justify-content: space-between;
    align-items: center;}
    `;
const TagInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  @media (min-width: 640px) { width: auto;}
  `;

const TagSymbol = styled.span`
  opacity: 0.4;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  `;

const TagInput = styled.input`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground);
  width: 100%;
  &::placeholder { opacity: 0.4; }
`;
const SaveButton = styled.button`
  background-color: var(--foreground);
  color: var(--background);
  padding: 1rem 2rem;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'Inter', sans-serif;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  @media (min-width: 640px) { width: auto; }
  &:hover { background-color: rgba(26, 26, 26, 0.8); }
`;
export default function InsightLabPage() {
  //form inputs
  const [bookTitle, setBookTitle] = useState("");
  const [insightText, setInsightText] = useState("");
  // API; Random Quote
  const [quote, setQuote] =useState(" New Quote..");
  const [author, setAuthor] = useState("");
  useEffect(() => {
    const fetchQuote =async () => {
      try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        const data= await response.json();
        setQuote(data.quote);
        setAuthor('-' + data.author);
      } catch(error) {
        console.error("Error fetching the quote", error);
        setQuote(" I think; Therefore I am.");
        setAuthor("- Rene Descartes ")
      }
    };
    fetchQuote();
  }, []);
  const [tag, setTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  //save data to Firebase
  const handleSave = async () => {
    //no empty notes
    if (!bookTitle || !insightText) {
      alert("Please fill out the book title and your insight!");
      return;
    }
    setIsSaving(true);
    try {
      // new document in a reflections
      await addDoc(collection(db, "reflections"), {
        book: bookTitle,
        insight: insightText,
        tag: tag || "General", 
        date: new Date().toLocaleDateString(),
      });
      // Clear the form
      setBookTitle("");
      setInsightText("");
      setTag("");
      alert("Insight saved successfully!");
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save. Check the console.");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <PageWrapper>      
      <Header>
        <div>
          <Title>Insight Lab</Title>
          <Subtitle>Distill your reading into action.</Subtitle>
        </div>
        <BackLink href="/library">&larr; Back to Library</BackLink>
      </Header>
      <CentralColumn>       
        <QuoteBanner>
          <CardLabel>Daily Inspiration</CardLabel>
          <Quote> "{quote}" </Quote>
          <QuoteAuthor>{author}</QuoteAuthor>
        </QuoteBanner>
        <Canvas>
          <BookInput 
            type="text" 
            placeholder="Select a book..."
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />         
          <TextArea 
            placeholder="What insight did you capture today? How does it apply to your life?" 
            value={insightText}
            onChange={(e) => setInsightText(e.target.value)}
          />         
          <CanvasFooter>
            <TagInputWrapper>
              <TagSymbol>#</TagSymbol>
              <TagInput 
                type="text" 
                placeholder="SelfImprovement, Mindset..."
                value={tag}
                onChange={(e) => setTag(e.target.value)} 
              />
            </TagInputWrapper>            
            <SaveButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving.." : "Save to Board"}
            </SaveButton>
          </CanvasFooter>
        </Canvas>
      </CentralColumn>      
    </PageWrapper>
  );
}