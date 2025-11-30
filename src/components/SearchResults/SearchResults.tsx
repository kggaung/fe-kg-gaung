/**
 * SearchResults Component
 * Displays search results with pagination
 */

import React from 'react';
import type { Entity } from '../../types';
import './SearchResults.css';

interface SearchResultsProps {
  results: Entity[];
  total: number;
  page: number;
  isLoading: boolean;
  error: string | null;
  onNextPage: () => void;
  onPrevPage: () => void;
  onResultClick?: (entity: Entity) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  total,
  page,
  isLoading,
  error,
  onNextPage,
  onPrevPage,
  onResultClick,
}) => {
  if (isLoading) {
    return (
      <div className="search-results-container">
        <div className="loading-state">
          <div className="spinner-large" />
          <p>Searching knowledge graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-container">
        <div className="error-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3>Search Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="search-results-container">
      <div className="results-header">
        <h2>Search Results</h2>
        <span className="results-count">
          {total} {total === 1 ? 'result' : 'results'} found
        </span>
      </div>

      <div className="results-grid">
        {results.map((entity) => (
          <div
            key={entity.id}
            className="result-card"
            onClick={() => onResultClick?.(entity)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onResultClick?.(entity);
              }
            }}
          >
            <div className="result-card-header">
              <h3 className="result-title">{entity.label}</h3>
              {entity.iso3Code && (
                <span className="result-badge">{entity.iso3Code}</span>
              )}
            </div>
            <div className="result-meta">
              <span className={`result-type type-${entity.type}`}>
                {entity.type}
              </span>
              <span className="result-id">{entity.id}</span>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={onPrevPage}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15l-5-5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Previous
          </button>
          
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          
          <button
            className="pagination-button"
            onClick={onNextPage}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            Next
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15l5-5-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
