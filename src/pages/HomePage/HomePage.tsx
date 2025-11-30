/**
 * HomePage Component
 * Main search and map page
 */

import React from 'react';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { SearchResults } from '../../components/SearchResults/SearchResults';
import { WorldMap } from '../../components/WorldMap/WorldMap';
import { InfoBoxSheet } from '../../components/InfoBox/InfoBoxSheet';
import { useSearch } from '../../hooks/useSearch';
import { useInfoBoxSheet } from '../../hooks/useInfoBoxSheet';
import type { Entity, CountryCoordinates } from '../../types';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { results, isLoading, error, search, total, page, nextPage, prevPage } = useSearch();
  const { isOpen, entityInfo, openSheet, closeSheet } = useInfoBoxSheet();

  const handleSearch = (query: string) => {
    search({ query });
  };

  const handleResultClick = (entity: Entity) => {
    openSheet(entity.id);
  };

  const handleCountryClick = (country: CountryCoordinates) => {
    // Open sheet using country label
    openSheet(country.label, true);
  };

  const handleRelatedEntityClick = (entityId: string) => {
    openSheet(entityId);
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
            onResultClick={handleResultClick}
          />
        </div>
      )}

      {/* Map Section */}
      <div className="map-section">
        <WorldMap onCountryClick={handleCountryClick} />
      </div>

      {/* InfoBox Sheet */}
      {entityInfo && (
        <InfoBoxSheet
          entityInfo={entityInfo}
          isOpen={isOpen}
          onClose={closeSheet}
          onRelatedEntityClick={handleRelatedEntityClick}
        />
      )}
    </div>
  );
};
