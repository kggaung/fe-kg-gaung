// Entity Types from RDF
export interface Entity {
  id: string;
  label: string;
  iso3Code?: string; // P298 property (ISO 3166-1 alpha-3)
  type: EntityType;
}

export type EntityType = 'country' | 'region' | 'organization';

// Health Record Types
export interface HealthRecord {
  id: string;
  location: string; // Entity ID
  year: number;
  hivCases?: number;
  malariaCases?: number;
  rabiesCases?: number;
  tuberculosisCases?: number;
  choleraCases?: number;
  guineaworm?: number;
  polioCases?: number;
  smallpoxCases?: number;
  bcg?: number;
  dtp3?: number;
  hepb3?: number;
  hib3?: number;
  measles1?: number;
  polio3?: number;
  rotavirus?: number;
  rubella1?: number;
  populationAge0?: number;
}

// Property Types
export interface Property {
  id: string;
  label: string;
  description?: string;
}

// API Response Types
export interface SearchResponse {
  results: Entity[];
  total: number;
  page: number;
  pageSize: number;
}

export interface EntityDetailResponse {
  entity: Entity;
  healthRecords: HealthRecord[];
  relatedEntities?: Entity[];
}

// Map Types
export interface CountryCoordinates {
  iso3Code: string;
  label: string;
  latitude: number;
  longitude: number;
}

// Search Params
export interface SearchParams {
  query: string;
  type?: EntityType;
  page?: number;
  pageSize?: number;
}

// API Error Response
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// SPARQL Query Types
export interface SPARQLQueryRequest {
  query: string;
  format?: 'json' | 'xml' | 'csv';
  limit?: number;
}

export interface SPARQLQueryResponse {
  head: {
    vars: string[];
  };
  results: {
    bindings: SPARQLBinding[];
  };
}

export interface SPARQLBinding {
  [key: string]: SPARQLValue;
}

export interface SPARQLValue {
  type: 'uri' | 'literal' | 'bnode';
  value: string;
  datatype?: string;
  'xml:lang'?: string;
}

export interface QueryHistory {
  id: string;
  query: string;
  timestamp: Date;
  executionTime?: number;
  resultCount?: number;
}

// Info Box Types
export interface EntityInfo {
  id: string;
  label: string;
  type: EntityType;
  description?: string;
  image?: string;
  attributes: EntityAttribute[];
  relatedEntities: RelatedEntity[];
  sources?: EntitySource[];
}

export interface EntityAttribute {
  property: string;
  propertyLabel: string;
  value: string;
  valueLabel?: string;
  valueType: 'string' | 'number' | 'date' | 'uri' | 'entity';
  unit?: string;
}

export interface RelatedEntity {
  id: string;
  label: string;
  type: EntityType;
  relationshipType: string;
  relationshipLabel: string;
  description?: string;
}

export interface EntitySource {
  name: string;
  url?: string;
  date?: string;
}

export interface InfoBoxResponse {
  entity: EntityInfo;
  sparqlQuery?: string;
}
