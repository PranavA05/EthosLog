"use client";
/* Sign In page */
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import {auth} from "./firebase"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  padding: 3rem 2rem;
  border: 1px solid rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`;

const Title = styled.h1`
  font-family: 'Georgia', serif;
  font-size: 1.5rem;
  text-align: center;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-family: 'Inter', sans-serif;
  border: 1px solid rgba(0,0,0,0.2);
  outline: none;
  font-size: 1rem;

  &:focus {
    border-color: black;
  }
`;

const SubmitButton = styled.button`
  background-color: black;
  color: white;
  padding: 0.75rem;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: rgba(0,0,0,0.8);
  }
`;

const ToggleText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  text-align: center;
  color: gray;
  cursor: pointer;

  &:hover {
    color: black;
    text-decoration: underline;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.75rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
`;
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); 
  const [error, setError] = useState("");
  const router = useRouter(); //redirects user after success

  const handleAuth = async (e:any) => {
    e.preventDefault(); 
    setError(""); 
    try {
      if (isLogin) {
        // Attempt to log in
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/library"); // Send if successful
      } else {
        // new account
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/library");
      }
    } catch (err) {
      // If an error (like wrong password), show
      setError((err as any).message);
    }
  };

  return (
    <PageContainer>
      <FormCard>
        <Title>{isLogin ? "Welcome Back" : "Start Your Log"}</Title>        
        {/* If there is an error, this will render it */}
        {error && <ErrorText>{error}</ErrorText>}
        <Input 
          type="email" 
          placeholder="Email address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />        
        <Input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton onClick={handleAuth}>
          {isLogin ? "Sign In" : "Sign Up"}
        </SubmitButton>
        <ToggleText onClick={() => setIsLogin(!isLogin)}>
          {isLogin 
            ? "Don't have an account? Sign up." 
            : "Already have an account? Sign in."}
        </ToggleText>
      </FormCard>
    </PageContainer>
  );
}