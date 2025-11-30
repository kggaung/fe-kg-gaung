/**
 * InfoBox Component
 * Displays detailed entity information similar to Google's info box
 * Following Single Responsibility Principle
 */

import React from 'react';
import type { EntityInfo } from '../../types';
import './InfoBox.css';

interface InfoBoxProps {
  entityInfo: EntityInfo;
  onRelatedEntityClick?: (entityId: string) => void;
}

export const InfoBox: React.FC<InfoBoxProps> = ({ entityInfo, onRelatedEntityClick }) => {
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

  return (
    <div className="infobox-container">
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
  );
};
