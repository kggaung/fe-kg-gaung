/**
 * Navbar Component
 * Navigation bar for the application
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="#6366f1" />
              <path
                d="M12 4L4 8v8c0 4.4 3.2 8.5 8 9.5 4.8-1 8-5.1 8-9.5V8l-8-4z"
                fill="white"
              />
              <circle cx="12" cy="12" r="2" fill="#6366f1" />
            </svg>
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-title">Knowledge Graph</span>
            <span className="navbar-subtitle">Health Data Explorer</span>
          </div>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Search</span>
          </Link>

          <Link
            to="/query"
            className={`navbar-link ${isActive('/query') ? 'active' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <span>SPARQL Query</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
