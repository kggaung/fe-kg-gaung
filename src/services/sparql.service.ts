/**
 * SPARQL Service
 * Handles SPARQL query execution following Single Responsibility Principle
 */

import { httpClient } from './http.client';
import type { IHttpClient } from './http.client';
import type {
  SPARQLQueryRequest,
  SPARQLQueryResponse,
  QueryHistory,
} from '../types';

/**
 * Interface for SPARQL service operations (Interface Segregation Principle)
 */
export interface ISPARQLService {
  executeQuery(request: SPARQLQueryRequest): Promise<SPARQLQueryResponse>;
  validateQuery(query: string): Promise<{ valid: boolean; error?: string }>;
  getSampleQueries(): Promise<string[]>;
  getQueryHistory(): Promise<QueryHistory[]>;
  saveQueryToHistory(query: string, executionTime?: number, resultCount?: number): Promise<void>;
}

/**
 * SPARQL Service Implementation
 * Depends on abstraction (IHttpClient) not concretion (Dependency Inversion Principle)
 */
class SPARQLService implements ISPARQLService {
  private client: IHttpClient;

  constructor(client: IHttpClient) {
    this.client = client;
  }

  /**
   * Execute SPARQL query
   * @param request Query request with SPARQL query string
   * @returns Query results in SPARQL JSON format
   */
  async executeQuery(request: SPARQLQueryRequest): Promise<SPARQLQueryResponse> {
    const response = await this.client.post<SPARQLQueryResponse>('/sparql/query', {
      query: request.query,
      format: request.format || 'json',
      limit: request.limit,
    });
    return response as SPARQLQueryResponse;
  }

  /**
   * Validate SPARQL query syntax
   * @param query SPARQL query string
   * @returns Validation result
   */
  async validateQuery(query: string): Promise<{ valid: boolean; error?: string }> {
    const response = await this.client.post<{ valid: boolean; error?: string }>(
      '/sparql/validate',
      { query }
    );
    return response as { valid: boolean; error?: string };
  }

  /**
   * Get sample SPARQL queries for user reference
   * @returns Array of sample query strings
   */
  async getSampleQueries(): Promise<string[]> {
    const response = await this.client.get<{ queries: string[] }>('/sparql/samples');
    return (response as { queries: string[] }).queries;
  }

  /**
   * Get query execution history
   * @returns Array of previous queries
   */
  async getQueryHistory(): Promise<QueryHistory[]> {
    const response = await this.client.get<{ history: QueryHistory[] }>('/sparql/history');
    return (response as { history: QueryHistory[] }).history;
  }

  /**
   * Save query to execution history
   * @param query SPARQL query string
   * @param executionTime Query execution time in ms
   * @param resultCount Number of results returned
   */
  async saveQueryToHistory(
    query: string,
    executionTime?: number,
    resultCount?: number
  ): Promise<void> {
    await this.client.post('/sparql/history', {
      query,
      executionTime,
      resultCount,
      timestamp: new Date().toISOString(),
    });
  }
}

// Use mock service for development
import { mockSPARQLService } from './sparql.service.mock';

// Toggle between mock and real service
const USE_MOCK = true;

// Export singleton instance (configured with httpClient)
export const sparqlService = USE_MOCK ? mockSPARQLService : new SPARQLService(httpClient);
