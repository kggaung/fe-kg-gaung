/**
 * WorldMap Component
 * Displays an interactive world map with clickable country markers
 */

import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import type { CountryCoordinates } from '../../types';
import { useMapData } from '../../hooks/useMapData';
import './WorldMap.css';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  onCountryClick?: (country: CountryCoordinates) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick }) => {
  const { countries, isLoading } = useMapData();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);

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
        {tooltipContent && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            {tooltipContent}
          </div>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 147,
            center: [0, 20],
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <ZoomableGroup onMove={(position) => setZoom(position.zoom)}>
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        fill: '#e2e8f0',
                        stroke: '#cbd5e1',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: '#cbd5e1',
                        stroke: '#94a3b8',
                        strokeWidth: 0.75,
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#94a3b8',
                        stroke: '#64748b',
                        strokeWidth: 1,
                        outline: 'none',
                      },
                    }}
                    onMouseEnter={() => {
                      setTooltipContent(geo.properties.name);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Country markers */}
            {countries.map((country) => {
              const isHovered = hoveredCountry === country.iso3Code;
              // Adjust marker size based on zoom level (smaller when zoomed out, larger when zoomed in)
              const baseRadius = 3.5 / zoom;
              const hoverRadius = 5 / zoom;
              const pulseRadius = 8 / zoom;
              const strokeWidth = 1.5 / zoom;

              return (
                <Marker
                  key={country.iso3Code}
                  coordinates={[country.longitude, country.latitude]}
                  onMouseEnter={() => {
                    setHoveredCountry(country.iso3Code);
                    setTooltipContent(country.label);
                  }}
                  onMouseLeave={() => {
                    setHoveredCountry(null);
                    setTooltipContent('');
                  }}
                  onClick={() => handleMarkerClick(country)}
                >
                  <circle
                    r={isHovered ? hoverRadius : baseRadius}
                    fill="#6366f1"
                    stroke="white"
                    strokeWidth={strokeWidth}
                    opacity={isHovered ? 1 : 0.85}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  />
                  {isHovered && (
                    <circle
                      r={pulseRadius}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth={strokeWidth * 1.33}
                      opacity={0.3}
                      style={{
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}
                    />
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
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
