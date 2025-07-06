// App.tsx - Updated with theme context
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import WhisperFeed from './components/WhisperFeed';
import WhisperDetail from './components/WhisperDetail';
import { ThemeContextProvider } from './components/contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WhisperFeed />} />
          <Route path="/whisper/:id" element={<WhisperDetail />} />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;