/**
 * InfoBoxSheet Component
 * Right-side expandable sheet for displaying entity information
 * Can be used across all pages
 * Features: Expand/Collapse, Fullscreen mode, Health Metrics display
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Set default year when health metrics are loaded
  React.useEffect(() => {
    if (entityInfo?.healthMetrics?.availableYears && entityInfo.healthMetrics.availableYears.length > 0) {
      setSelectedYear(entityInfo.healthMetrics.availableYears[0]); // Default to most recent year
    }
  }, [entityInfo?.healthMetrics]);
  
  // Filter health metrics by selected year
  const filteredHealthMetrics = React.useMemo(() => {
    const healthMetrics = entityInfo?.healthMetrics;
    if (!healthMetrics || !selectedYear) return healthMetrics;
    
    return {
      diseaseCases: healthMetrics.diseaseCases.filter(m => m.year === selectedYear),
      vaccinationCoverage: healthMetrics.vaccinationCoverage.filter(m => m.year === selectedYear),
      population: healthMetrics.population.filter(m => m.year === selectedYear),
      availableYears: healthMetrics.availableYears,
    };
  }, [entityInfo?.healthMetrics, selectedYear]);

  if (!entityInfo) return null;

  const { label, type, description, image, attributes, healthMetrics, relatedEntities, sources } = entityInfo;

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

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setIsExpanded(false); // Close expand mode when entering fullscreen
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className={`infobox-sheet-overlay ${isExpanded ? 'expanded' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div className={`infobox-sheet ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''} ${isFullscreen ? 'fullscreen' : ''}`}>
        {/* Sheet Header */}
        <div className="infobox-sheet-header">
          <div className="infobox-sheet-header-actions">
            <button 
              className="infobox-sheet-expand-btn" 
              onClick={toggleExpand}
              title={isExpanded ? 'Collapse' : 'Expand'}
              disabled={isFullscreen}
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
            <button 
              className="infobox-sheet-fullscreen-btn" 
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {isFullscreen ? (
                  <path 
                    d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                ) : (
                  <path 
                    d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
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

          {/* Health Metrics Section */}
          {healthMetrics && (
            <div className="infobox-section">
              <div className="infobox-health-header">
                <h2 className="infobox-section-title">Health Data</h2>
                {healthMetrics.availableYears.length > 0 && (
                  <select 
                    className="infobox-year-selector"
                    value={selectedYear || ''}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {healthMetrics.availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                )}
              </div>
              
              {/* Disease Cases */}
              {filteredHealthMetrics && filteredHealthMetrics.diseaseCases.length > 0 && (
                <div className="infobox-health-category">
                  <h3 className="infobox-health-category-title">Disease Cases</h3>
                  <div className="infobox-health-grid">
                    {filteredHealthMetrics.diseaseCases.map((metric) => (
                      <div key={metric.id} className="infobox-health-card">
                        <div className="infobox-health-label">{metric.label}</div>
                        <div className="infobox-health-value">
                          {formatNumber(metric.value)}
                          {metric.unit && <span className="infobox-health-unit"> {metric.unit}</span>}
                        </div>
                        <div className="infobox-health-year">Year: {metric.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vaccination Coverage */}
              {filteredHealthMetrics && filteredHealthMetrics.vaccinationCoverage.length > 0 && (
                <div className="infobox-health-category">
                  <h3 className="infobox-health-category-title">Vaccination Coverage (One-year-olds)</h3>
                  <div className="infobox-health-grid">
                    {filteredHealthMetrics.vaccinationCoverage.map((metric) => (
                      <div key={metric.id} className="infobox-health-card">
                        <div className="infobox-health-label">{metric.label}</div>
                        <div className="infobox-health-value">
                          {formatNumber(metric.value)}
                          {metric.unit && <span className="infobox-health-unit"> {metric.unit}</span>}
                        </div>
                        <div className="infobox-health-year">Year: {metric.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Population */}
              {filteredHealthMetrics && filteredHealthMetrics.population.length > 0 && (
                <div className="infobox-health-category">
                  <h3 className="infobox-health-category-title">Population Data</h3>
                  <div className="infobox-health-grid">
                    {filteredHealthMetrics.population.map((metric) => (
                      <div key={metric.id} className="infobox-health-card">
                        <div className="infobox-health-label">{metric.label}</div>
                        <div className="infobox-health-value">
                          {formatNumber(metric.value)}
                          {metric.unit && <span className="infobox-health-unit"> {metric.unit}</span>}
                        </div>
                        <div className="infobox-health-year">Year: {metric.year}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
