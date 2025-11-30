/**
 * Mock Search Service
 * Provides mock search results for development without backend
 */

import type { Entity, SearchParams, SearchResponse } from '../types';

const mockEntities: Entity[] = [
  { id: 'wd:Q252', label: 'Indonesia', iso3Code: 'IDN', type: 'country' },
  { id: 'wd:Q668', label: 'India', iso3Code: 'IND', type: 'country' },
  { id: 'wd:Q155', label: 'Brazil', iso3Code: 'BRA', type: 'country' },
  { id: 'wd:Q30', label: 'United States', iso3Code: 'USA', type: 'country' },
  { id: 'wd:Q148', label: 'China', iso3Code: 'CHN', type: 'country' },
  { id: 'wd:Q55', label: 'Netherlands', iso3Code: 'NLD', type: 'country' },
  { id: 'wd:Q145', label: 'United Kingdom', iso3Code: 'GBR', type: 'country' },
  { id: 'wd:Q183', label: 'Germany', iso3Code: 'DEU', type: 'country' },
  { id: 'wd:Q142', label: 'France', iso3Code: 'FRA', type: 'country' },
  { id: 'wd:Q38', label: 'Italy', iso3Code: 'ITA', type: 'country' },
  { id: 'wd:Q96', label: 'Mexico', iso3Code: 'MEX', type: 'country' },
  { id: 'wd:Q17', label: 'Japan', iso3Code: 'JPN', type: 'country' },
  { id: 'wd:Q884', label: 'South Korea', iso3Code: 'KOR', type: 'country' },
  { id: 'wd:Q408', label: 'Australia', iso3Code: 'AUS', type: 'country' },
  { id: 'wd:Q258', label: 'South Africa', iso3Code: 'ZAF', type: 'country' },
  { id: 'wd:Q79', label: 'Egypt', iso3Code: 'EGY', type: 'country' },
  { id: 'wd:Q414', label: 'Argentina', iso3Code: 'ARG', type: 'country' },
  { id: 'wd:Q298', label: 'Chile', iso3Code: 'CHL', type: 'country' },
  { id: 'wd:Q159', label: 'Russia', iso3Code: 'RUS', type: 'country' },
  { id: 'wd:Q16', label: 'Canada', iso3Code: 'CAN', type: 'country' },
  { id: 'wd:Q11708', label: 'South-East Asia', type: 'region' },
  { id: 'wd:Q865', label: 'South Asia', type: 'region' },
  { id: 'wd:Q7159', label: 'World Health Organization', type: 'organization' },
];

export class MockSearchService {
  async search(params: SearchParams): Promise<SearchResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const { query, type, page = 1, pageSize = 10 } = params;

    // Filter by query
    let filtered = mockEntities.filter(entity =>
      entity.label.toLowerCase().includes(query.toLowerCase())
    );

    // Filter by type if specified
    if (type) {
      filtered = filtered.filter(entity => entity.type === type);
    }

    // Pagination
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const results = filtered.slice(start, end);

    return {
      results,
      total,
      page,
      pageSize,
    };
  }

  async getSuggestions(query: string): Promise<Entity[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return mockEntities
      .filter(entity => entity.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }
}

export const mockSearchService = new MockSearchService();
