import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import OrderForm from './components/OrderForm';
import TokenForm from './components/TokenForm';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.header`
  background: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

function App() {
  const [token, setToken] = useState(localStorage.getItem('tablecrm_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (tokenValue) => {
    try {
      const response = await axios.get(`https://app.tablecrm.com/api/v1/docs_sales/?token=${tokenValue}`);
      setIsAuthenticated(true);
      localStorage.setItem('tablecrm_token', tokenValue);
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem('tablecrm_token');
      console.error('Token validation failed:', error);
    }
  };

  const handleTokenSubmit = (tokenValue) => {
    setToken(tokenValue);
    validateToken(tokenValue);
  };

  const handleLogout = () => {
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('tablecrm_token');
  };

  return (
    <AppContainer>
      <Header>
        <h1>TableCRM - Мобильная касса</h1>
        {isAuthenticated && (
          <button onClick={handleLogout} style={{
            background: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}>
            Выйти
          </button>
        )}
      </Header>
      
      {!isAuthenticated ? (
        <TokenForm onTokenSubmit={handleTokenSubmit} />
      ) : (
        <OrderForm token={token} />
      )}
    </AppContainer>
  );
}

export default App;