/**
 * Map Service following Single Responsibility Principle
 * Handles map-related data and operations
 */

import { httpClient, type IHttpClient } from './http.client';
import type { CountryCoordinates, Entity } from '../types';

export interface IMapService {
  getCountryCoordinates(): Promise<CountryCoordinates[]>;
  getCountryInfo(iso3Code: string): Promise<Entity>;
}

class MapService implements IMapService {
  private client: IHttpClient;

  constructor(client: IHttpClient) {
    this.client = client;
  }

  /**
   * Get coordinates for all countries to display on map
   * GET /api/map/countries
   */
  async getCountryCoordinates(): Promise<CountryCoordinates[]> {
    return this.client.get<CountryCoordinates[]>('/map/countries');
  }

  /**
   * Get detailed country information by ISO code
   * GET /api/map/countries/{iso3Code}
   */
  async getCountryInfo(iso3Code: string): Promise<Entity> {
    return this.client.get<Entity>(`/map/countries/${iso3Code}`);
  }
}

export const mapService = new MapService(httpClient);
