# Backend API Documentation

## Overview
This document outlines the REST API endpoints that need to be implemented for the Knowledge Graph Health Data Explorer frontend application.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. This can be added in future iterations.

## API Endpoints

### 1. Search Entities

**Endpoint:** `GET /api/search`

**Description:** Search for entities in the knowledge graph based on query string.

**Query Parameters:**
- `query` (required): Search term (string)
- `type` (optional): Filter by entity type - `country`, `region`, or `organization`
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Number of results per page (default: 10)

**Example Request:**
```
GET /api/search?query=Indonesia&type=country&page=1&pageSize=10
```

**Response Format:**
```json
{
  "results": [
    {
      "id": "wd:Q252",
      "label": "Indonesia",
      "iso3Code": "IDN",
      "type": "country"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10
}
```

**Status Codes:**
- `200 OK`: Successful search
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

---

### 2. Get Entity by ID

**Endpoint:** `GET /api/entities/{id}`

**Description:** Retrieve detailed information about a specific entity.

**Path Parameters:**
- `id` (required): Entity ID (e.g., "wd:Q252")

**Example Request:**
```
GET /api/entities/wd:Q252
```

**Response Format:**
```json
{
  "entity": {
    "id": "wd:Q252",
    "label": "Indonesia",
    "iso3Code": "IDN",
    "type": "country"
  },
  "healthRecords": [
    {
      "id": "kgr:Q252_2020",
      "location": "wd:Q252",
      "year": 2020,
      "hivCases": 45000,
      "malariaCases": 120000,
      "tuberculosisCases": 85000,
      "bcg": 95.5,
      "dtp3": 93.2
    }
  ],
  "relatedEntities": [
    {
      "id": "wd:Q11708",
      "label": "South-East Asia",
      "type": "region"
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Entity found
- `404 Not Found`: Entity not found
- `500 Internal Server Error`: Server error

---

### 3. Search Suggestions (Autocomplete)

**Endpoint:** `GET /api/search/suggestions`

**Description:** Get search suggestions for autocomplete functionality.

**Query Parameters:**
- `query` (required): Search term (minimum 2 characters)

**Example Request:**
```
GET /api/search/suggestions?query=indo
```

**Response Format:**
```json
[
  {
    "id": "wd:Q252",
    "label": "Indonesia",
    "iso3Code": "IDN",
    "type": "country"
  },
  {
    "id": "wd:Q668",
    "label": "India",
    "iso3Code": "IND",
    "type": "country"
  }
]
```

**Status Codes:**
- `200 OK`: Suggestions returned (can be empty array)
- `400 Bad Request`: Query too short
- `500 Internal Server Error`: Server error

---

### 4. Get Country Coordinates

**Endpoint:** `GET /api/map/countries`

**Description:** Retrieve coordinates for all countries to display on the map.

**Example Request:**
```
GET /api/map/countries
```

**Response Format:**
```json
[
  {
    "iso3Code": "IDN",
    "label": "Indonesia",
    "latitude": -2.5489,
    "longitude": 118.0149
  },
  {
    "iso3Code": "IND",
    "label": "India",
    "latitude": 20.5937,
    "longitude": 78.9629
  }
]
```

**Status Codes:**
- `200 OK`: Country data returned
- `500 Internal Server Error`: Server error

---

### 5. Get Country Info by ISO Code

**Endpoint:** `GET /api/map/countries/{iso3Code}`

**Description:** Get detailed country information using ISO 3166-1 alpha-3 code.

**Path Parameters:**
- `iso3Code` (required): Three-letter country code (e.g., "IDN")

**Example Request:**
```
GET /api/map/countries/IDN
```

**Response Format:**
```json
{
  "id": "wd:Q252",
  "label": "Indonesia",
  "iso3Code": "IDN",
  "type": "country"
}
```

**Status Codes:**
- `200 OK`: Country found
- `404 Not Found`: Country not found
- `500 Internal Server Error`: Server error

---

## Data Models

### Entity
```typescript
{
  id: string;          // e.g., "wd:Q252"
  label: string;       // e.g., "Indonesia"
  iso3Code?: string;   // e.g., "IDN" (for countries)
  type: "country" | "region" | "organization";
}
```

### HealthRecord
```typescript
{
  id: string;
  location: string;           // Entity ID
  year: number;               // e.g., 2020
  hivCases?: number;
  malariaCases?: number;
  rabiesCases?: number;
  tuberculosisCases?: number;
  choleraCases?: number;
  guineaworm?: number;
  polioCases?: number;
  smallpoxCases?: number;
  bcg?: number;               // Vaccination percentage
  dtp3?: number;
  hepb3?: number;
  hib3?: number;
  measles1?: number;
  polio3?: number;
  rotavirus?: number;
  rubella1?: number;
  populationAge0?: number;
}
```

### CountryCoordinates
```typescript
{
  iso3Code: string;
  label: string;
  latitude: number;
  longitude: number;
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**
- `INVALID_QUERY`: Query parameter validation failed
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server internal error
- `INVALID_ENTITY_ID`: Invalid entity ID format

---

## Implementation Notes

### Data Source
The backend should query the RDF files in the `rdf/` directory:
- `entity.ttl` - Contains all entities (countries, regions, organizations)
- `property.ttl` - Contains property definitions
- `health_record.ttl` - Contains health records with year and location data

### Search Implementation
1. Parse RDF data to extract entities
2. Implement full-text search on entity labels
3. Filter by entity type (country/region/organization)
4. Support pagination

### Coordinate Mapping
For the `/api/map/countries` endpoint, you'll need to create a mapping of ISO 3166-1 alpha-3 codes to geographic coordinates. A sample mapping is provided in `src/data/country-coordinates.json`.

### Performance Considerations
- Implement caching for frequently accessed data
- Index RDF data for faster queries
- Consider using SPARQL queries for complex relationships

---

## 6. SPARQL Query Execution

**Endpoint:** `POST /api/sparql/query`

**Description:** Execute a SPARQL query against the Knowledge Graph endpoint.

**Request Body:**
```json
{
  "query": "SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object . } LIMIT 10",
  "format": "json",
  "limit": 1000
}
```

**Response Format:**
```json
{
  "head": {
    "vars": ["subject", "predicate", "object"]
  },
  "results": {
    "bindings": [
      {
        "subject": {
          "type": "uri",
          "value": "http://example.org/IND"
        },
        "predicate": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#label"
        },
        "object": {
          "type": "literal",
          "value": "Indonesia"
        }
      }
    ]
  }
}
```

**Status Codes:**
- `200 OK`: Query executed successfully
- `400 Bad Request`: Invalid SPARQL syntax
- `500 Internal Server Error`: Query execution failed

---

### 7. Validate SPARQL Query

**Endpoint:** `POST /api/sparql/validate`

**Description:** Validate SPARQL query syntax without executing.

**Request Body:**
```json
{
  "query": "SELECT ?s ?p ?o WHERE { ?s ?p ?o . }"
}
```

**Response Format:**
```json
{
  "valid": true
}
```

Or if invalid:
```json
{
  "valid": false,
  "error": "Syntax error at line 1: Expected '{' but found '}'"
}
```

**Status Codes:**
- `200 OK`: Validation completed
- `400 Bad Request`: Missing query parameter

---

### 8. Get Sample Queries

**Endpoint:** `GET /api/sparql/samples`

**Description:** Get a list of sample SPARQL queries for user reference.

**Response Format:**
```json
{
  "queries": [
    "SELECT ?country ?label WHERE { ?country rdf:type <http://example.org/Country> . ?country rdfs:label ?label . } LIMIT 10",
    "SELECT ?year ?hivCases WHERE { ?record <http://example.org/location> <http://example.org/IND> . ?record <http://example.org/year> ?year . ?record <http://example.org/hivCases> ?hivCases . } ORDER BY ?year",
    "SELECT (COUNT(?record) as ?count) WHERE { ?record rdf:type <http://example.org/HealthRecord> . }"
  ]
}
```

**Status Codes:**
- `200 OK`: Samples retrieved successfully

---

### 9. Get Query History

**Endpoint:** `GET /api/sparql/history`

**Description:** Get user's query execution history.

**Query Parameters:**
- `limit` (optional): Number of history items (default: 20)

**Response Format:**
```json
{
  "history": [
    {
      "id": "hist_001",
      "query": "SELECT * WHERE { ?s ?p ?o . } LIMIT 10",
      "timestamp": "2025-12-01T10:30:00Z",
      "executionTime": 245,
      "resultCount": 10
    }
  ]
}
```

**Status Codes:**
- `200 OK`: History retrieved successfully

---

### 10. Save Query to History

**Endpoint:** `POST /api/sparql/history`

**Description:** Save executed query to user's history.

**Request Body:**
```json
{
  "query": "SELECT * WHERE { ?s ?p ?o . } LIMIT 10",
  "executionTime": 245,
  "resultCount": 10,
  "timestamp": "2025-12-01T10:30:00Z"
}
```

**Response Format:**
```json
{
  "success": true,
  "id": "hist_001"
}
```

**Status Codes:**
- `201 Created`: History saved successfully
- `400 Bad Request`: Invalid request body

---

## Testing

### Sample Test Scenarios

1. **Search for "Indonesia"**
   - Should return entity with id "wd:Q252"
   - Should include ISO code "IDN"

2. **Get entity "wd:Q252"**
   - Should return Indonesia entity
   - Should include health records with various years
   - Should include related entities (regions)

3. **Search suggestions for "ind"**
   - Should return multiple results (India, Indonesia, etc.)
   - Results should be limited to top 5-10 matches

4. **Get all country coordinates**
   - Should return 193+ countries with coordinates
   - Each country should have valid lat/long values

---

## Future Enhancements

1. **Filtering and Sorting**
   - Add more filter options (by region, by health indicator)
   - Support sorting by different fields

2. **Advanced Search**
   - Support boolean operators (AND, OR, NOT)
   - Search by health record data ranges

3. **Aggregations**
   - Get statistics across regions
   - Time-series data for health indicators

4. **GraphQL API**
   - Consider implementing GraphQL for more flexible queries

5. **Real-time Updates**
   - WebSocket support for live data updates

---

## Contact & Support

For questions about API implementation, refer to the RDF data structure in the `rdf/` directory or contact the frontend development team.
