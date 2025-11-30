/**
 * EntityPage Component
 * Displays entity information in an info box
 * Integrates with search and SPARQL query features
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InfoBox } from '../../components/InfoBox/InfoBox';
import { useEntityInfo } from '../../hooks/useEntityInfo';
import './EntityPage.css';

export const EntityPage: React.FC = () => {
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const { entityInfo, isLoading, error, fetchEntityInfo } = useEntityInfo(entityId);

  useEffect(() => {
    if (entityId) {
      fetchEntityInfo(decodeURIComponent(entityId));
    }
  }, [entityId, fetchEntityInfo]);

  const handleRelatedEntityClick = (relatedEntityId: string) => {
    navigate(`/entity/${encodeURIComponent(relatedEntityId)}`);
  };

  const handleBackToSearch = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="entity-page">
        <div className="entity-page-container">
          <div className="entity-loading-state">
            <div className="spinner-large" />
            <p>Loading entity information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="entity-page">
        <div className="entity-page-container">
          <div className="entity-error-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h2>Failed to Load Entity</h2>
            <p>{error}</p>
            <button className="entity-back-button" onClick={handleBackToSearch}>
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!entityInfo) {
    return (
      <div className="entity-page">
        <div className="entity-page-container">
          <div className="entity-empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h2>Entity Not Found</h2>
            <p>The requested entity could not be found.</p>
            <button className="entity-back-button" onClick={handleBackToSearch}>
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="entity-page">
      <div className="entity-page-container">
        {/* Breadcrumb Navigation */}
        <div className="entity-breadcrumb">
          <button className="entity-breadcrumb-link" onClick={handleBackToSearch}>
            ← Back to Search
          </button>
        </div>

        {/* Info Box */}
        <InfoBox entityInfo={entityInfo} onRelatedEntityClick={handleRelatedEntityClick} />

        {/* Additional Actions */}
        <div className="entity-actions">
          <button
            className="entity-action-button"
            onClick={() => navigate(`/query?entity=${encodeURIComponent(entityInfo.id)}`)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 9h8M8 13h6M9 20H7c-1.5 0-2-1-2-2V6c0-1 .5-2 2-2h10c1.5 0 2 1 2 2v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="17" cy="17" r="3" stroke="currentColor" strokeWidth="2" />
              <path d="M19.5 19.5L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Query in SPARQL Console
          </button>
        </div>
      </div>
    </div>
  );
};
