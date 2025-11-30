/**
 * QueryPage Component
 * Main page for SPARQL query interface
 */

import React, { useState } from 'react';
import { QueryEditor } from '../../components/QueryEditor/QueryEditor';
import { QueryResults } from '../../components/QueryResults/QueryResults';
import { useSPARQLQuery } from '../../hooks/useSPARQLQuery';
import './QueryPage.css';

export const QueryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const { results, isExecuting, error, executionTime, executeQuery, clearResults } =
    useSPARQLQuery();

  const handleExecute = () => {
    if (query.trim()) {
      executeQuery({ query, format: 'json' });
    }
  };

  const handleClear = () => {
    setQuery('');
    clearResults();
  };

  return (
    <div className="query-page">
      <div className="query-page-header">
        <div className="query-page-title-section">
          <h1 className="query-page-title">SPARQL Query Console</h1>
          <p className="query-page-description">
            Execute SPARQL queries directly against the Knowledge Graph endpoint. Explore health
            data across countries and regions using semantic queries.
          </p>
        </div>
        
        <div className="query-page-info">
          <div className="info-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="info-content">
              <span className="info-label">Tips</span>
              <span className="info-text">Use Ctrl+Enter to execute query</span>
            </div>
          </div>
        </div>
      </div>

      <div className="query-page-content">
        <div className="query-editor-section">
          <QueryEditor
            query={query}
            onChange={setQuery}
            onExecute={handleExecute}
            isExecuting={isExecuting}
            onClear={handleClear}
          />
        </div>

        <div className="query-results-section">
          <QueryResults
            results={results}
            executionTime={executionTime}
            error={error}
            isExecuting={isExecuting}
          />
        </div>
      </div>
    </div>
  );
};
