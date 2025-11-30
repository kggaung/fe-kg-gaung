/**
 * Search Service following Interface Segregation Principle
 * Handles all search-related API calls
 */

import { httpClient, type IHttpClient } from './http.client';
import type { SearchParams, SearchResponse, Entity, EntityDetailResponse } from '../types';

export interface ISearchService {
  search(params: SearchParams): Promise<SearchResponse>;
  getEntityById(id: string): Promise<EntityDetailResponse>;
  getSuggestions(query: string): Promise<Entity[]>;
}

class SearchService implements ISearchService {
  private client: IHttpClient;

  constructor(client: IHttpClient) {
    this.client = client;
  }

  /**
   * Search entities in the knowledge graph
   * GET /api/search?query={query}&type={type}&page={page}&pageSize={pageSize}
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams({
      query: params.query,
      ...(params.type && { type: params.type }),
      ...(params.page && { page: params.page.toString() }),
      ...(params.pageSize && { pageSize: params.pageSize.toString() }),
    });

    return this.client.get<SearchResponse>(`/search?${queryParams.toString()}`);
  }

  /**
   * Get detailed information about a specific entity
   * GET /api/entities/{id}
   */
  async getEntityById(id: string): Promise<EntityDetailResponse> {
    return this.client.get<EntityDetailResponse>(`/entities/${id}`);
  }

  /**
   * Get search suggestions for autocomplete
   * GET /api/search/suggestions?query={query}
   */
  async getSuggestions(query: string): Promise<Entity[]> {
    if (query.length < 2) {
      return [];
    }
    return this.client.get<Entity[]>(`/search/suggestions?query=${encodeURIComponent(query)}`);
  }
}

// Use mock service for development
import { mockSearchService } from './search.service.mock';

// Toggle between mock and real service
const USE_MOCK = true;

export const searchService = USE_MOCK ? mockSearchService : new SearchService(httpClient);
