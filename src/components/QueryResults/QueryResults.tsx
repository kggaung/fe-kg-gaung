/**
 * QueryResults Component
 * Displays SPARQL query results in table format
 */

import React, { useState } from 'react';
import type { SPARQLQueryResponse } from '../../types';
import './QueryResults.css';

interface QueryResultsProps {
  results: SPARQLQueryResponse | null;
  executionTime: number | null;
  error: string | null;
  isExecuting: boolean;
}

export const QueryResults: React.FC<QueryResultsProps> = ({
  results,
  executionTime,
  error,
  isExecuting,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  if (isExecuting) {
    return (
      <div className="query-results-container">
        <div className="results-loading">
          <div className="spinner-large" />
          <p>Executing query...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="query-results-container">
        <div className="results-error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3>Query Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="query-results-container">
        <div className="results-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3>No Results</h3>
          <p>Execute a query to see results here</p>
        </div>
      </div>
    );
  }

  const bindings = results.results.bindings;
  const variables = results.head.vars;
  
  // Pagination
  const totalResults = bindings.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalResults);
  const currentBindings = bindings.slice(startIndex, endIndex);

  const formatValue = (value: { type: string; value: string; datatype?: string } | undefined) => {
    if (!value) return '-';
    
    if (value.type === 'uri') {
      const uri = value.value;
      const shortUri = uri.split('/').pop() || uri.split('#').pop() || uri;
      return (
        <a
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          className="uri-link"
          title={uri}
        >
          {shortUri}
        </a>
      );
    }
    
    return value.value;
  };

  const handleExport = () => {
    // Simple CSV export
    const headers = variables.join(',');
    const rows = bindings.map((binding) =>
      variables.map((v) => {
        const value = binding[v];
        return value ? `"${value.value.replace(/"/g, '""')}"` : '';
      }).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-results-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="query-results-container">
      <div className="results-header">
        <div className="results-info">
          <span className="results-count">
            {totalResults} result{totalResults !== 1 ? 's' : ''}
          </span>
          {executionTime !== null && (
            <span className="results-time">
              Executed in {executionTime}ms
            </span>
          )}
        </div>
        <button className="btn-export" onClick={handleExport}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th className="row-number-header">#</th>
              {variables.map((variable) => (
                <th key={variable}>{variable}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentBindings.map((binding, index) => (
              <tr key={startIndex + index}>
                <td className="row-number">{startIndex + index + 1}</td>
                {variables.map((variable) => (
                  <td key={variable}>{formatValue(binding[variable])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="results-pagination">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages} ({startIndex + 1}-{endIndex} of {totalResults})
          </span>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
