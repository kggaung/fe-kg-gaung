/**
 * Main App Component
 * Integrates search and map functionality
 */

import { useState } from 'react';
import { SearchBar } from './components/SearchBar/SearchBar';
import { SearchResults } from './components/SearchResults/SearchResults';
import { WorldMap } from './components/WorldMap/WorldMap';
import { useSearch } from './hooks/useSearch';
import type { Entity, CountryCoordinates } from './types';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, isLoading, error, total, page, search, nextPage, prevPage } = useSearch();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search({ query });
  };

  const handleResultClick = (entity: Entity) => {
    console.log('Entity clicked:', entity);
    // Future: Navigate to detail page or show modal
  };

  const handleCountryClick = (country: CountryCoordinates) => {
    console.log('Country clicked:', country);
    // Future: Show info box with country details
    setSearchQuery(country.label);
    search({ query: country.label });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#6366f1" />
                <path
                  d="M16 8v16M8 16h16"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="logo-text">
              <h1>Knowledge Graph</h1>
              <p>Health Data Explorer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Search Section */}
        <section className="search-section">
          <div className="section-content">
            <div className="search-intro">
              <h2 className="section-title">Search Knowledge Graph</h2>
              <p className="section-description">
                Explore global health data and discover insights about countries, regions, 
                and health indicators from our comprehensive knowledge graph.
              </p>
            </div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>

        {/* Search Results */}
        {searchQuery && (
          <SearchResults
            results={results}
            total={total}
            page={page}
            isLoading={isLoading}
            error={error}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            onResultClick={handleResultClick}
          />
        )}

        {/* Map Section */}
        <section className="map-section">
          <WorldMap onCountryClick={handleCountryClick} />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 Knowledge Graph Health Data Explorer. All rights reserved.</p>
          <p className="footer-note">
            Data sourced from RDF knowledge base containing global health records.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
