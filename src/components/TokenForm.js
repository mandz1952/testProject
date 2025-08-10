import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  padding: 2rem;
  max-width: 400px;
  margin: 2rem auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #2980b9;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

function TokenForm({ onTokenSubmit }) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    
    setIsLoading(true);
    await onTokenSubmit(token.trim());
    setIsLoading(false);
  };

  return (
    <FormContainer>
      <Title>Авторизация</Title>
      <Description>
        Введите токен для доступа к кассе TableCRM
      </Description>
      
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Введите токен авторизации"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={isLoading}
        />
        
        <Button type="submit" disabled={!token.trim() || isLoading}>
          {isLoading ? 'Проверка...' : 'Войти'}
        </Button>
      </form>
    </FormContainer>
  );
}

export default TokenForm;