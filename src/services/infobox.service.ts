/**
 * InfoBox Service
 * Handles entity detail retrieval following SOLID principles
 * Interface Segregation Principle (ISP) - focused interface
 * Dependency Inversion Principle (DIP) - depends on IHttpClient abstraction
 */

import { httpClient } from './http.client';
import type { IHttpClient } from './http.client';
import type { EntityInfo, InfoBoxResponse } from '../types';

/**
 * InfoBox Service Interface
 * Defines contract for entity information retrieval
 */
export interface IInfoBoxService {
  /**
   * Get detailed information about an entity
   * @param entityId - Entity ID (URI or local identifier)
   * @returns Promise with entity information
   */
  getEntityInfo(entityId: string): Promise<EntityInfo>;

  /**
   * Get entity information by label (search-based)
   * @param label - Entity label/name
   * @returns Promise with entity information
   */
  getEntityByLabel(label: string): Promise<EntityInfo>;

  /**
   * Get related entities for an entity
   * @param entityId - Entity ID
   * @param limit - Maximum number of related entities
   * @returns Promise with array of related entity info
   */
  getRelatedEntities(entityId: string, limit?: number): Promise<EntityInfo[]>;
}

/**
 * InfoBox Service Implementation
 * Single Responsibility Principle (SRP) - only handles entity info retrieval
 */
export class InfoBoxService implements IInfoBoxService {
  private readonly http: IHttpClient;

  constructor(http: IHttpClient) {
    this.http = http;
  }

  async getEntityInfo(entityId: string): Promise<EntityInfo> {
    try {
      const response = await this.http.get<InfoBoxResponse>(`/entity/${encodeURIComponent(entityId)}`);
      return (response as InfoBoxResponse).entity;
    } catch (error) {
      console.error('Failed to fetch entity info:', error);
      throw new Error('Failed to fetch entity information');
    }
  }

  async getEntityByLabel(label: string): Promise<EntityInfo> {
    try {
      const response = await this.http.get<InfoBoxResponse>('/entity/by-label', {
        params: { label },
      });
      return (response as InfoBoxResponse).entity;
    } catch (error) {
      console.error('Failed to fetch entity by label:', error);
      throw new Error('Failed to fetch entity by label');
    }
  }

  async getRelatedEntities(entityId: string, limit = 10): Promise<EntityInfo[]> {
    try {
      const response = await this.http.get<{ entities: EntityInfo[] }>('/entity/related', {
        params: { 
          entityId: encodeURIComponent(entityId),
          limit: limit.toString(),
        },
      });
      return (response as { entities: EntityInfo[] }).entities;
    } catch (error) {
      console.error('Failed to fetch related entities:', error);
      throw new Error('Failed to fetch related entities');
    }
  }
}

// Export singleton instance following Dependency Injection pattern
export const infoBoxService = new InfoBoxService(httpClient);
