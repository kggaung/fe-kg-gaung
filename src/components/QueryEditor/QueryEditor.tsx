/**
 * QueryEditor Component
 * SPARQL query editor with syntax highlighting and sample queries
 */

import React, { useState } from 'react';
import { useSampleQueries } from '../../hooks/useSampleQueries';
import './QueryEditor.css';

interface QueryEditorProps {
  query: string;
  onChange: (query: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  onClear: () => void;
}

export const QueryEditor: React.FC<QueryEditorProps> = ({
  query,
  onChange,
  onExecute,
  isExecuting,
  onClear,
}) => {
  const { samples, isLoading: samplesLoading } = useSampleQueries();
  const [showSamples, setShowSamples] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Execute on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onExecute();
    }

    // Tab insertion
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = query.substring(0, start) + '  ' + query.substring(end);
      onChange(newValue);
      // Set cursor position after tab
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      }, 0);
    }
  };

  const loadSample = (sample: string) => {
    onChange(sample);
    setShowSamples(false);
  };

  return (
    <div className="query-editor-container">
      <div className="query-editor-header">
        <h3 className="query-editor-title">SPARQL Query Editor</h3>
        <div className="query-editor-actions">
          <button
            className="btn-secondary"
            onClick={() => setShowSamples(!showSamples)}
            disabled={samplesLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Sample Queries
          </button>
          <button className="btn-secondary" onClick={onClear} disabled={isExecuting}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear
          </button>
          <button
            className="btn-primary"
            onClick={onExecute}
            disabled={isExecuting || !query.trim()}
          >
            {isExecuting ? (
              <>
                <div className="spinner-small" />
                Executing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Execute (Ctrl+Enter)
              </>
            )}
          </button>
        </div>
      </div>

      {showSamples && samples.length > 0 && (
        <div className="sample-queries-dropdown">
          <div className="sample-queries-header">
            <span>Select a sample query</span>
            <button
              className="close-button"
              onClick={() => setShowSamples(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="sample-queries-list">
            {samples.map((sample, index) => (
              <button
                key={index}
                className="sample-query-item"
                onClick={() => loadSample(sample)}
              >
                <pre>{sample.split('\n')[0]}</pre>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="query-editor-wrapper">
        <textarea
          className="query-editor-textarea"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your SPARQL query here...&#10;&#10;Example:&#10;SELECT ?subject ?predicate ?object&#10;WHERE {&#10;  ?subject ?predicate ?object .&#10;}&#10;LIMIT 10"
          spellCheck={false}
          disabled={isExecuting}
        />
        <div className="query-editor-footer">
          <span className="query-info">
            {query.split('\n').length} lines | {query.length} characters
          </span>
        </div>
      </div>
    </div>
  );
};
