/**
 * Main App Component
 * Router configuration and layout
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { HomePage } from './pages/HomePage/HomePage';
import { QueryPage } from './pages/QueryPage/QueryPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/query" element={<QueryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
