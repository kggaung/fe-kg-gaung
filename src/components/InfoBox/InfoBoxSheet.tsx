/**
 * InfoBoxSheet Component
 * Right-side expandable sheet for displaying entity information
 * Can be used across all pages
 */

import React, { useState } from 'react';
import type { EntityInfo } from '../../types';
import './InfoBoxSheet.css';

interface InfoBoxSheetProps {
  entityInfo: EntityInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onRelatedEntityClick?: (entityId: string) => void;
}

export const InfoBoxSheet: React.FC<InfoBoxSheetProps> = ({
  entityInfo,
  isOpen,
  onClose,
  onRelatedEntityClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!entityInfo) return null;

  const { label, type, description, image, attributes, relatedEntities, sources } = entityInfo;

  const handleRelatedClick = (entityId: string) => {
    if (onRelatedEntityClick) {
      onRelatedEntityClick(entityId);
    }
  };

  const formatValue = (value: string, valueType: string): string => {
    if (valueType === 'date') {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    if (valueType === 'number') {
      return parseFloat(value).toLocaleString();
    }
    return value;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className={`infobox-sheet-overlay ${isExpanded ? 'expanded' : ''}`}
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div className={`infobox-sheet ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}>
        {/* Sheet Header */}
        <div className="infobox-sheet-header">
          <button 
            className="infobox-sheet-expand-btn" 
            onClick={toggleExpand}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {isExpanded ? (
                <path 
                  d="M5 12h14M12 5l7 7-7 7" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              ) : (
                <path 
                  d="M19 12H5M12 19l-7-7 7-7" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
          <button className="infobox-sheet-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Sheet Content */}
        <div className="infobox-sheet-content">
          {/* Header Section */}
          <div className="infobox-header">
            <h1 className="infobox-title">{label}</h1>
            <span className="infobox-type">{type}</span>
          </div>

          {/* Image Section */}
          {image && (
            <div className="infobox-image-wrapper">
              <img src={image} alt={label} className="infobox-image" />
            </div>
          )}

          {/* Description Section */}
          {description && (
            <div className="infobox-section">
              <p className="infobox-description">{description}</p>
            </div>
          )}

          {/* Attributes Section */}
          {attributes.length > 0 && (
            <div className="infobox-section">
              <h2 className="infobox-section-title">Attributes</h2>
              <div className="infobox-attributes">
                {attributes.map((attr, index) => (
                  <div key={index} className="infobox-attribute-row">
                    <div className="infobox-attribute-label">{attr.propertyLabel}</div>
                    <div className="infobox-attribute-value">
                      {attr.valueType === 'entity' && attr.valueLabel ? (
                        <button
                          className="infobox-entity-link"
                          onClick={() => handleRelatedClick(attr.value)}
                        >
                          {attr.valueLabel}
                        </button>
                      ) : (
                        <>
                          {formatValue(attr.value, attr.valueType)}
                          {attr.unit && <span className="infobox-unit"> {attr.unit}</span>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Entities Section */}
          {relatedEntities.length > 0 && (
            <div className="infobox-section">
              <h2 className="infobox-section-title">Related Entities</h2>
              <div className="infobox-related-grid">
                {relatedEntities.map((related) => (
                  <button
                    key={related.id}
                    className="infobox-related-card"
                    onClick={() => handleRelatedClick(related.id)}
                  >
                    <div className="infobox-related-relation">{related.relationshipLabel}</div>
                    <div className="infobox-related-label">{related.label}</div>
                    {related.description && (
                      <div className="infobox-related-description">{related.description}</div>
                    )}
                    <div className="infobox-related-type">{related.type}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sources Section */}
          {sources && sources.length > 0 && (
            <div className="infobox-section">
              <h2 className="infobox-section-title">Sources</h2>
              <div className="infobox-sources">
                {sources.map((source, index) => (
                  <div key={index} className="infobox-source-item">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="infobox-source-link"
                      >
                        {source.name}
                      </a>
                    ) : (
                      <span className="infobox-source-name">{source.name}</span>
                    )}
                    {source.date && <span className="infobox-source-date"> ({source.date})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
