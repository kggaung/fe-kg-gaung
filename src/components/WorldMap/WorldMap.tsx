/**
 * WorldMap Component
 * Displays an interactive world map with clickable country markers
 */

import React, { useState } from 'react';
import type { CountryCoordinates } from '../../types';
import { useMapData } from '../../hooks/useMapData';
import './WorldMap.css';

interface WorldMapProps {
  onCountryClick?: (country: CountryCoordinates) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick }) => {
  const { countries, isLoading, error } = useMapData();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="map-container">
        <div className="map-loading">
          <div className="spinner-large" />
          <p>Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-container">
        <div className="map-error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3>Map Loading Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const handleMarkerClick = (country: CountryCoordinates) => {
    onCountryClick?.(country);
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="map-title">World Health Data Map</h2>
        <p className="map-subtitle">
          Click on any country marker to view detailed information
        </p>
      </div>

      <div className="map-wrapper">
        <svg
          className="world-map-svg"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect width="1000" height="500" fill="#f0f9ff" />

          {/* Grid lines for reference */}
          <g className="grid-lines" opacity="0.2">
            {[...Array(11)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 50}
                x2="1000"
                y2={i * 50}
                stroke="#94a3b8"
                strokeWidth="0.5"
              />
            ))}
            {[...Array(21)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 50}
                y1="0"
                x2={i * 50}
                y2="500"
                stroke="#94a3b8"
                strokeWidth="0.5"
              />
            ))}
          </g>

          {/* Country markers */}
          <g className="country-markers">
            {countries.map((country) => {
              // Convert lat/long to SVG coordinates (simplified projection)
              // Longitude: -180 to 180 -> 0 to 1000
              // Latitude: 90 to -90 -> 0 to 500
              const x = ((country.longitude + 180) / 360) * 1000;
              const y = ((90 - country.latitude) / 180) * 500;

              const isHovered = hoveredCountry === country.iso3Code;

              return (
                <g
                  key={country.iso3Code}
                  className={`country-marker ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredCountry(country.iso3Code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => handleMarkerClick(country)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Marker circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 8 : 6}
                    fill="#6366f1"
                    stroke="white"
                    strokeWidth="2"
                    opacity={isHovered ? 1 : 0.8}
                    className="marker-circle"
                  />

                  {/* Pulse animation on hover */}
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      opacity="0"
                      className="marker-pulse"
                    />
                  )}

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <g className="marker-tooltip">
                      <rect
                        x={x + 15}
                        y={y - 25}
                        width={country.label.length * 7 + 20}
                        height="30"
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        rx="6"
                        filter="url(#tooltip-shadow)"
                      />
                      <text
                        x={x + 25}
                        y={y - 5}
                        fontSize="12"
                        fontWeight="600"
                        fill="#1f2937"
                      >
                        {country.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Shadow filter for tooltips */}
          <defs>
            <filter id="tooltip-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-marker"></div>
          <span>Country with health data</span>
        </div>
        <div className="legend-stats">
          {countries.length} countries available
        </div>
      </div>
    </div>
  );
};
