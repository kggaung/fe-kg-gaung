/**
 * HomePage Component
 * Main search and map page
 */

import React from 'react';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { SearchResults } from '../../components/SearchResults/SearchResults';
import { WorldMap } from '../../components/WorldMap/WorldMap';
import { useSearch } from '../../hooks/useSearch';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { results, isLoading, error, search, total, page, nextPage, prevPage } = useSearch();

  const handleSearch = (query: string) => {
    search({ query });
  };

  return (
    <div className="home-page">
      {/* Hero Section with Search */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Search Knowledge Graph</h1>
          <p className="hero-description">
            Explore global health data and discover insights about countries, regions, and health
            indicators from our comprehensive knowledge graph.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Search Results */}
      {(results.length > 0 || isLoading || error) && (
        <div className="search-results-section">
          <SearchResults 
            results={results} 
            isLoading={isLoading} 
            error={error}
            total={total}
            page={page}
            onNextPage={nextPage}
            onPrevPage={prevPage}
          />
        </div>
      )}

      {/* Map Section */}
      <div className="map-section">
        <WorldMap onCountryClick={(country) => console.log('Country clicked:', country)} />
      </div>
    </div>
  );
};
