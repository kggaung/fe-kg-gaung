# Developer Guide

> Comprehensive guide for backend developers and team members continuing feature development

## 📋 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Backend Requirements](#backend-requirements)
- [API Endpoints](#api-endpoints)
- [Mock Services](#mock-services)
- [Feature Development](#feature-development)
- [Code Structure](#code-structure)
- [Testing](#testing)

---

## 🏗️ Architecture Overview

### SOLID Principles Implementation

The codebase follows SOLID principles for maintainability and extensibility:

1. **Single Responsibility Principle (SRP)**
   - Each service handles one domain (Search, SPARQL, InfoBox)
   - Components have single, well-defined purposes
   - Hooks manage specific state concerns

2. **Open/Closed Principle (OCP)**
   - Service interfaces allow extension without modification
   - Component props enable customization

3. **Liskov Substitution Principle (LSP)**
   - Mock services implement same interfaces as real services
   - Seamless swapping for testing and development

4. **Interface Segregation Principle (ISP)**
   - Focused interfaces with only necessary methods
   - `IHttpClient`, `ISearchService`, `ISPARQLService`, `IInfoBoxService`

5. **Dependency Inversion Principle (DIP)**
   - Services depend on `IHttpClient` abstraction
   - Easy to swap HTTP client implementations

### Service Layer Pattern

```
Component → Hook → Service Interface → Service Implementation → HTTP Client → Backend API
```

**Example Flow:**
```typescript
SearchBar → useSearch → ISearchService → SearchService → httpClient → GET /api/search
```

### Type System

All types are centralized in `src/types/index.ts`:
- `Entity`: Base entity type
- `SearchResult`, `SearchResponse`: Search-related types
- `EntityInfo`, `EntityAttribute`, `RelatedEntity`: Info Box types
- `SPARQLQueryRequest`, `SPARQLQueryResponse`: SPARQL types

---

## 🔌 Backend Requirements

### Data Sources

RDF data files located at `d:\Tugas\5_KG\TK\rdf\`:
```
rdf/
├── entity.ttl          # Countries, regions, organizations (193+ entities)
├── property.ttl        # Property definitions (HIV, malaria, BCG, etc.)
└── health_record.ttl   # Health data by year and location
```

### Technology Recommendations

1. **RDF Store**: Apache Jena, Virtuoso, or GraphDB
2. **SPARQL Endpoint**: Built-in endpoint from RDF store
3. **Backend Framework**: Node.js (Express), Python (FastAPI), or Java (Spring Boot)
4. **Parsing**: RDFLib (Python), rdflib.js (Node.js), or Apache Jena (Java)

### Setup Steps

1. **Install RDF Store**
   ```bash
   # Example: Apache Jena Fuseki
   wget https://downloads.apache.org/jena/binaries/apache-jena-fuseki-x.x.x.tar.gz
   tar -xzf apache-jena-fuseki-x.x.x.tar.gz
   cd apache-jena-fuseki-x.x.x
   ```

2. **Load RDF Data**
   ```bash
   # Using Fuseki TDB loader
   ./tdb2.tdbloader --loc=./data entity.ttl property.ttl health_record.ttl
   ```

3. **Start SPARQL Endpoint**
   ```bash
   ./fuseki-server --loc=./data /kg
   # Endpoint: http://localhost:3030/kg/sparql
   ```

4. **Implement REST API** (see API Endpoints section)

---

## 🛠️ API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Search Entities

**Endpoint:** `GET /api/search`

**Query Parameters:**
- `query` (required, string): Search term
- `type` (optional, string): Filter by `country`, `region`, or `organization`
- `page` (optional, number): Page number (default: 1)
- `pageSize` (optional, number): Results per page (default: 10)

**Example Request:**
```http
GET /api/search?query=Indonesia&type=country&page=1&pageSize=10
```

**Response:**
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

**SPARQL Query Example:**
```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>

SELECT ?entity ?label ?iso3Code ?type WHERE {
  ?entity rdfs:label ?label .
  FILTER(CONTAINS(LCASE(?label), LCASE("Indonesia")))
  
  OPTIONAL { ?entity wdt:P298 ?iso3Code . }
  
  # Type detection
  BIND(
    IF(EXISTS { ?entity wdt:P31 wd:Q6256 }, "country",
    IF(EXISTS { ?entity wdt:P31 wd:Q82794 }, "region", "organization"))
  AS ?type)
}
LIMIT 10
```

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

---

### 2. Search Suggestions (Autocomplete)

**Endpoint:** `GET /api/search/suggestions`

**Query Parameters:**
- `query` (required, string, min 2 chars): Search term

**Example Request:**
```http
GET /api/search/suggestions?query=ind
```

**Response:**
```json
[
  { "id": "wd:Q252", "label": "Indonesia", "iso3Code": "IDN", "type": "country" },
  { "id": "wd:Q668", "label": "India", "iso3Code": "IND", "type": "country" }
]
```

**Implementation Notes:**
- Return max 10 results
- Sort by relevance (exact match first, then prefix match)
- Filter minimum 2 characters

---

### 3. Get Entity Info (Info Box)

**Endpoint:** `GET /api/entity/{entityId}`

**Path Parameters:**
- `entityId` (required): Entity ID (e.g., "wd:Q252")

**Example Request:**
```http
GET /api/entity/wd:Q252
```

**Response:**
```json
{
  "id": "wd:Q252",
  "label": "Indonesia",
  "type": "country",
  "description": "Country in Southeast Asia and Oceania",
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/320px-Flag_of_Indonesia.svg.png",
  "attributes": [
    {
      "property": "wdt:P298",
      "propertyLabel": "ISO 3166-1 alpha-3 code",
      "value": "IDN",
      "valueLabel": "IDN",
      "valueType": "string"
    },
    {
      "property": "wdt:P1082",
      "propertyLabel": "Population",
      "value": "273523615",
      "valueLabel": "273,523,615",
      "valueType": "number"
    },
    {
      "property": "wdt:P36",
      "propertyLabel": "Capital",
      "value": "wd:Q3630",
      "valueLabel": "Jakarta",
      "valueType": "entity"
    }
  ],
  "relatedEntities": [
    {
      "id": "wd:Q11708",
      "label": "South-East Asia",
      "type": "region",
      "relationshipType": "wdt:P361",
      "relationshipLabel": "part of"
    }
  ],
  "sources": [
    {
      "name": "Wikidata",
      "url": "https://www.wikidata.org/wiki/Q252"
    }
  ]
}
```

**SPARQL Query Example:**
```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX schema: <http://schema.org/>

SELECT ?property ?propertyLabel ?value ?valueLabel WHERE {
  wd:Q252 ?property ?value .
  ?property rdfs:label ?propertyLabel .
  FILTER(LANG(?propertyLabel) = "en")
  
  OPTIONAL { ?value rdfs:label ?valueLabel . FILTER(LANG(?valueLabel) = "en") }
}
```

---

### 4. Get Entity by Label

**Endpoint:** `GET /api/entity/by-label`

**Query Parameters:**
- `label` (required, string): Entity label (e.g., "Indonesia")

**Example Request:**
```http
GET /api/entity/by-label?label=Indonesia
```

**Response:** Same as endpoint #3 (Get Entity Info)

---

### 5. Get Related Entities

**Endpoint:** `GET /api/entity/related`

**Query Parameters:**
- `entityId` (required, string): Entity ID
- `limit` (optional, number): Max results (default: 10)

**Example Request:**
```http
GET /api/entity/related?entityId=wd:Q252&limit=5
```

**Response:**
```json
[
  {
    "id": "wd:Q11708",
    "label": "South-East Asia",
    "type": "region",
    "description": "Subregion of Asia"
  },
  {
    "id": "wd:Q3630",
    "label": "Jakarta",
    "type": "city",
    "description": "Capital of Indonesia"
  }
]
```

---

### 6. Get Map Countries

**Endpoint:** `GET /api/map/countries`

**Description:** Returns all countries with geographic coordinates

**Example Request:**
```http
GET /api/map/countries
```

**Response:**
```json
[
  {
    "iso3Code": "IDN",
    "label": "Indonesia",
    "latitude": -0.7893,
    "longitude": 113.9213
  },
  {
    "iso3Code": "IND",
    "label": "India",
    "latitude": 20.5937,
    "longitude": 78.9629
  }
]
```

**Implementation Notes:**
- Reference coordinates in `src/data/country-coordinates.ts`
- Return all 193 countries
- Coordinates should be centroid of country

---

### 7. Get Country by ISO Code

**Endpoint:** `GET /api/map/countries/{iso3Code}`

**Path Parameters:**
- `iso3Code` (required): ISO 3166-1 alpha-3 code (e.g., "IDN")

**Example Request:**
```http
GET /api/map/countries/IDN
```

**Response:**
```json
{
  "id": "wd:Q252",
  "label": "Indonesia",
  "iso3Code": "IDN",
  "type": "country"
}
```

---

### 8. Execute SPARQL Query

**Endpoint:** `POST /api/sparql/query`

**Request Body:**
```json
{
  "query": "SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10",
  "format": "json",
  "limit": 1000
}
```

**Response:** SPARQL JSON Results Format
```json
{
  "head": {
    "vars": ["s", "p", "o"]
  },
  "results": {
    "bindings": [
      {
        "s": { "type": "uri", "value": "http://www.wikidata.org/entity/Q252" },
        "p": { "type": "uri", "value": "http://www.w3.org/2000/01/rdf-schema#label" },
        "o": { "type": "literal", "value": "Indonesia", "xml:lang": "en" }
      }
    ]
  }
}
```

**Implementation:**
- Proxy to SPARQL endpoint
- Apply limit if not specified (default: 1000)
- Timeout: 30 seconds
- Validate query syntax before execution

---

### 9. Validate SPARQL Query

**Endpoint:** `POST /api/sparql/validate`

**Request Body:**
```json
{
  "query": "SELECT ?s ?p ?o WHERE { ?s ?p ?o }"
}
```

**Response:**
```json
{
  "valid": true
}
```

or

```json
{
  "valid": false,
  "message": "Syntax error: Expected keyword WHERE at line 1"
}
```

---

### 10. Get Sample SPARQL Queries

**Endpoint:** `GET /api/sparql/samples`

**Example Request:**
```http
GET /api/sparql/samples
```

**Response:**
```json
[
  {
    "id": "1",
    "title": "List all countries",
    "query": "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nSELECT ?country ?label WHERE {\n  ?country wdt:P31 wd:Q6256 .\n  ?country rdfs:label ?label .\n  FILTER(LANG(?label) = \"en\")\n}\nLIMIT 10"
  },
  {
    "id": "2",
    "title": "Countries with population",
    "query": "PREFIX wd: <http://www.wikidata.org/entity/>\nPREFIX wdt: <http://www.wikidata.org/prop/direct/>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n\nSELECT ?country ?label ?population WHERE {\n  ?country wdt:P31 wd:Q6256 .\n  ?country rdfs:label ?label .\n  ?country wdt:P1082 ?population .\n  FILTER(LANG(?label) = \"en\")\n}\nORDER BY DESC(?population)\nLIMIT 10"
  }
]
```

---

### 11. Get Query History

**Endpoint:** `GET /api/sparql/history`

**Example Request:**
```http
GET /api/sparql/history
```

**Response:**
```json
[
  {
    "id": "1701234567890",
    "query": "SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10",
    "timestamp": "2025-12-01T12:34:56.789Z",
    "executionTime": 245,
    "resultCount": 10
  }
]
```

---

### 12. Save Query to History

**Endpoint:** `POST /api/sparql/history`

**Request Body:**
```json
{
  "query": "SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10",
  "executionTime": 245,
  "resultCount": 10
}
```

**Response:**
```json
{
  "id": "1701234567890",
  "message": "Query saved to history"
}
```

---

### 13. Get Health Records

**Endpoint:** `GET /api/entities/{id}/health-records`

**Path Parameters:**
- `id` (required): Entity ID

**Query Parameters:**
- `startYear` (optional): Filter from year
- `endYear` (optional): Filter to year

**Example Request:**
```http
GET /api/entities/wd:Q252/health-records?startYear=2015&endYear=2020
```

**Response:**
```json
[
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
]
```

---

## 🎭 Mock Services

### Current State

Mock services are **ENABLED** for frontend development:

```typescript
// src/services/search.service.ts
const USE_MOCK = true; // ← Change to false when backend is ready
```

### Mock Data Available

1. **Search Service** (`search.service.mock.ts`)
   - 20+ countries
   - 2 regions
   - 1 organization
   - Search by name (case-insensitive)
   - Pagination support

2. **InfoBox Service** (`infobox.service.mock.ts`)
   - 4 detailed entities: Indonesia, India, Brazil, South-East Asia
   - Full attributes, related entities, sources

3. **SPARQL Service** (`sparql.service.mock.ts`)
   - 2 sample queries
   - Mock results with 5 countries
   - Query history tracking

### Switching to Real Backend

When backend is implemented, change `USE_MOCK` to `false` in these files:
- `src/services/search.service.ts`
- `src/services/sparql.service.ts`
- `src/services/infobox.service.ts`

```typescript
const USE_MOCK = false; // Use real backend
export const searchService = USE_MOCK ? mockSearchService : new SearchService(httpClient);
```

---

## 🎯 Feature Development

### Adding New Features

Follow this workflow when adding new features:

#### 1. Define Types
```typescript
// src/types/index.ts
export interface NewFeature {
  id: string;
  name: string;
  // ... other properties
}
```

#### 2. Create Service Interface
```typescript
// src/services/newfeature.service.ts
interface INewFeatureService {
  getData(): Promise<NewFeature[]>;
}
```

#### 3. Implement Service
```typescript
export class NewFeatureService implements INewFeatureService {
  constructor(private httpClient: IHttpClient) {}
  
  async getData(): Promise<NewFeature[]> {
    const response = await this.httpClient.get<NewFeature[]>('/api/newfeature');
    return response.data;
  }
}
```

#### 4. Create Mock Service (Optional)
```typescript
// src/services/newfeature.service.mock.ts
export class MockNewFeatureService implements INewFeatureService {
  async getData(): Promise<NewFeature[]> {
    return [/* mock data */];
  }
}
```

#### 5. Create Custom Hook
```typescript
// src/hooks/useNewFeature.ts
export const useNewFeature = () => {
  const [data, setData] = useState<NewFeature[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await newFeatureService.getData();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);
  
  return { data, loading };
};
```

#### 6. Create Component
```typescript
// src/components/NewFeature/NewFeature.tsx
export const NewFeature: React.FC = () => {
  const { data, loading } = useNewFeature();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
};
```

---

## 📂 Code Structure

### Directory Organization

```
src/
├── components/           # Reusable UI components
│   ├── Component/
│   │   ├── Component.tsx    # Component logic
│   │   └── Component.css    # Component styles
│   └── ...
├── pages/               # Page-level components
│   ├── PageName/
│   │   ├── PageName.tsx
│   │   └── PageName.css
│   └── ...
├── services/            # API service layer
│   ├── *.service.ts         # Real API implementations
│   ├── *.service.mock.ts    # Mock implementations
│   └── http-client.service.ts
├── hooks/               # Custom React hooks
│   └── use*.ts
├── types/               # TypeScript definitions
│   └── index.ts
├── data/                # Static data
│   └── *.ts
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

### Naming Conventions

- **Components**: PascalCase (e.g., `SearchBar.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSearch.ts`)
- **Services**: camelCase with `.service` suffix (e.g., `search.service.ts`)
- **Types**: PascalCase (e.g., `interface EntityInfo`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Import Order

```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal services
import { searchService } from '../../services/search.service';

// 3. Internal types
import type { SearchResult } from '../../types';

// 4. Internal components
import { SearchBar } from '../../components/SearchBar/SearchBar';

// 5. Styles
import './HomePage.css';
```

---

## 🧪 Testing

### Manual Testing Checklist

**Search Functionality:**
- [ ] Type query in search bar
- [ ] Autocomplete shows suggestions
- [ ] Select suggestion populates search
- [ ] Press Enter executes search
- [ ] Results display with correct icons
- [ ] Pagination works (Next/Previous)
- [ ] Type filter works (Country/Region/Organization)

**World Map:**
- [ ] Map loads with all country markers
- [ ] Zoom in/out scales markers correctly
- [ ] Click country marker opens Info Box
- [ ] Hover shows country name tooltip

**Info Box:**
- [ ] Opens from search results
- [ ] Opens from map markers
- [ ] Displays all sections (header, image, description, attributes, related, sources)
- [ ] Expand button works (400px → 60vw)
- [ ] Collapse button works (60vw → 400px)
- [ ] Click related entity navigates correctly
- [ ] Close button works
- [ ] Overlay click closes in expanded mode

**SPARQL Console:**
- [ ] Navigate to /query page
- [ ] Sample queries dropdown shows 2 queries
- [ ] Select sample loads query in editor
- [ ] Type custom query in editor
- [ ] Tab key inserts 2 spaces
- [ ] Ctrl+Enter executes query
- [ ] Execute button works
- [ ] Results table displays data
- [ ] Pagination works in results
- [ ] CSV export downloads file
- [ ] Clear button resets editor and results

**Cross-Browser:**
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**Responsive:**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Backend Integration Testing

1. **Set USE_MOCK to false** in all service files
2. **Start backend server** on http://localhost:3000
3. **Run frontend**: `npm run dev`
4. **Test each feature** with real API calls
5. **Check browser console** for errors
6. **Verify network requests** in DevTools Network tab

---

## 📖 Additional Resources

### Related Files
- `README.md` - Public documentation
- `API_DOCUMENTATION.md` - Detailed API specs (legacy, merged into this doc)
- `.env.example` - Environment configuration template

### External Documentation
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/guide/)
- [SPARQL 1.1 Query Language](https://www.w3.org/TR/sparql11-query/)
- [RDF 1.1 Concepts](https://www.w3.org/TR/rdf11-concepts/)

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build
npm run lint             # Lint code

# Type checking
npx tsc --noEmit         # Check TypeScript errors

# Dependencies
npm install              # Install dependencies
npm update               # Update dependencies
npm outdated             # Check outdated packages
```

---

## 🚀 Next Steps for Backend Team

1. **Setup RDF Store** (Apache Jena Fuseki recommended)
2. **Load RDF data** from `d:\Tugas\5_KG\TK\rdf\` directory
3. **Implement REST API** with 13 endpoints (see API Endpoints section)
4. **Test each endpoint** individually with Postman/curl
5. **Update frontend** by setting `USE_MOCK = false`
6. **Integration testing** with frontend
7. **Deploy** backend and frontend

### Priority Order
1. **High Priority** (Required for core functionality):
   - GET /api/search
   - GET /api/search/suggestions
   - GET /api/entity/{entityId}
   - GET /api/map/countries

2. **Medium Priority** (Enhances experience):
   - GET /api/entity/by-label
   - GET /api/entity/related
   - POST /api/sparql/query
   - GET /api/sparql/samples

3. **Low Priority** (Nice to have):
   - POST /api/sparql/validate
   - GET /api/sparql/history
   - POST /api/sparql/history
   - GET /api/entities/{id}/health-records

---

## 💡 Tips & Best Practices

### Performance
- Use pagination for large result sets
- Implement caching for frequent queries
- Optimize SPARQL queries with LIMIT and FILTER
- Use indexes on RDF store

### Security
- Sanitize SPARQL queries to prevent injection
- Implement rate limiting
- Add CORS configuration
- Validate all inputs

### Error Handling
- Return consistent error format:
  ```json
  {
    "error": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
  ```
- Use appropriate HTTP status codes
- Log errors for debugging

### Documentation
- Document all API changes
- Update this file when adding features
- Comment complex logic
- Keep README.md up to date

---

**Questions?** Open an issue or contact the team lead.

**Happy coding! 🎉**
