# Developer Guide

> Comprehensive guide for backend developers and team members continuing feature development

## 📋 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Backend Requirements](#backend-requirements)
- [API Endpoints](#api-endpoints)
- [Health Metrics Integration](#health-metrics-integration)
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

## 🏥 Health Metrics Integration

### Overview

Frontend terintegrasi dengan 19 health metrics dari RDF design:
- **9 Disease Cases**: HIV/AIDS, Malaria, Tuberculosis, Rabies, Cholera, Yaws, Polio, Smallpox, Guinea Worm
- **8 Vaccination Coverage**: BCG, DTP3, HepB3, Hib3, Measles1, Polio3, Rotavirus, Rubella1
- **1 Population Data**: Population Age 0

### Year Selector Feature

Frontend memiliki fitur **year selector dropdown** yang memungkinkan user memilih tahun spesifik untuk melihat data kesehatan:

**Key Features:**
- Dropdown muncul di sebelah "Health Data" title
- Default: tahun terbaru (dari `availableYears[0]`)
- Client-side filtering (instant update, no API calls)
- Styling: Purple accent konsisten dengan tema

**User Flow:**
1. User klik country marker atau search result
2. Info Box terbuka dengan health metrics
3. Default tampil data tahun terbaru
4. User bisa pilih tahun lain dari dropdown
5. Data health metrics update otomatis

### API Endpoints Required

#### 1. GET /api/entity/{entityId} (with health metrics)

**Query Parameters:**
- `includeHealthMetrics` (optional, boolean, default: true)
- `year` (optional, number): Filter by specific year (optional - frontend prefer all years)

**Example:**
```http
GET /api/entity/wd:Q252?includeHealthMetrics=true
```

**Response Format:**
```json
{
  "id": "wd:Q252",
  "label": "Indonesia",
  "type": "country",
  "healthMetrics": {
    "diseaseCases": [
      { "id": "hivCases", "label": "HIV/AIDS Cases", "value": 45000, "year": 2020, "category": "disease" },
      { "id": "hivCases", "label": "HIV/AIDS Cases", "value": 43500, "year": 2019, "category": "disease" },
      { "id": "malariaCases", "label": "Malaria Cases", "value": 120000, "year": 2020, "category": "disease" }
    ],
    "vaccinationCoverage": [
      { "id": "bcg", "label": "BCG", "value": 3250000, "year": 2020, "unit": "children", "category": "vaccination" },
      { "id": "bcg", "label": "BCG", "value": 3200000, "year": 2019, "unit": "children", "category": "vaccination" }
    ],
    "population": [
      { "id": "populationAge0", "label": "Population Age 0", "value": 4650000, "year": 2020, "unit": "children", "category": "population" }
    ],
    "availableYears": [2020, 2019, 2018]
  }
}
```

**Important:**
- Return **all years** of data (multi-year support)
- `availableYears` array MUST be sorted descending (newest first)
- Each metric item MUST include `year` field
- Frontend handles filtering by selected year

#### 2. GET /api/entity/{entityId}/health-metrics

**Query Parameters:**
- `year` (optional, number): Filter by specific year

**Example:**
```http
GET /api/entity/wd:Q252/health-metrics
```

**Response:** Same `healthMetrics` object as endpoint #1

#### 3. GET /api/entity/{entityId}/health-metrics/timeseries (Future)

**Query Parameters:**
- `metricId` (required): e.g., "hivCases", "bcg"
- `startYear` (optional): Default 10 years ago
- `endYear` (optional): Default current year

**Response:**
```json
{
  "entityId": "wd:Q252",
  "metricId": "hivCases",
  "metricLabel": "HIV/AIDS Cases",
  "data": [
    { "year": 2018, "value": 42000 },
    { "year": 2019, "value": 43500 },
    { "year": 2020, "value": 45000 }
  ]
}
```

### SPARQL Query Template (All Years)

```sparql
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX kgp: <http://example.org/>
PREFIX schema: <http://schema.org/>

SELECT ?year ?hivCases ?malariaCases ?tuberculosisCases ?rabiesCases 
       ?choleraCases ?yawsCases ?polioCases ?smallpoxCases ?guineaworm
       ?bcg ?dtp3 ?hepb3 ?hib3 ?measles1 ?polio3 ?rotavirus ?rubella1
       ?populationAge0
WHERE {
  ?healthRecord kgp:location wd:Q252 .
  ?healthRecord schema:year ?year .
  
  # Disease Cases
  OPTIONAL { ?healthRecord kgp:hivCases ?hivCases . }
  OPTIONAL { ?healthRecord kgp:malariaCases ?malariaCases . }
  OPTIONAL { ?healthRecord kgp:tuberculosisCases ?tuberculosisCases . }
  OPTIONAL { ?healthRecord kgp:rabiesCases ?rabiesCases . }
  OPTIONAL { ?healthRecord kgp:choleraCases ?choleraCases . }
  OPTIONAL { ?healthRecord kgp:yawsCases ?yawsCases . }
  OPTIONAL { ?healthRecord kgp:polioCases ?polioCases . }
  OPTIONAL { ?healthRecord kgp:smallpoxCases ?smallpoxCases . }
  OPTIONAL { ?healthRecord kgp:guineaworm ?guineaworm . }
  
  # Vaccination Coverage
  OPTIONAL { ?healthRecord kgp:bcg ?bcg . }
  OPTIONAL { ?healthRecord kgp:dtp3 ?dtp3 . }
  OPTIONAL { ?healthRecord kgp:hepb3 ?hepb3 . }
  OPTIONAL { ?healthRecord kgp:hib3 ?hib3 . }
  OPTIONAL { ?healthRecord kgp:measles1 ?measles1 . }
  OPTIONAL { ?healthRecord kgp:polio3 ?polio3 . }
  OPTIONAL { ?healthRecord kgp:rotavirus ?rotavirus . }
  OPTIONAL { ?healthRecord kgp:rubella1 ?rubella1 . }
  
  # Population
  OPTIONAL { ?healthRecord kgp:populationAge0 ?populationAge0 . }
}
ORDER BY DESC(?year)
```

**⚠️ Important:** DO NOT use `LIMIT 1` - return all available years!

### Data Transformation Logic (Backend)

```python
def transform_health_metrics(sparql_results, filter_year=None):
    disease_metrics = []
    vaccination_metrics = []
    population_metrics = []
    available_years = set()
    
    DISEASE_METRICS = {
        'hivCases': 'HIV/AIDS Cases',
        'malariaCases': 'Malaria Cases',
        'tuberculosisCases': 'Tuberculosis Cases',
        'rabiesCases': 'Rabies Cases',
        'choleraCases': 'Cholera Cases',
        'yawsCases': 'Yaws Cases',
        'polioCases': 'Polio Cases',
        'smallpoxCases': 'Smallpox Cases',
        'guineaworm': 'Guinea Worm Disease',
    }
    
    VACCINATION_METRICS = {
        'bcg': 'BCG',
        'dtp3': 'DTP3',
        'hepb3': 'HepB3',
        'hib3': 'Hib3',
        'measles1': 'Measles (1st dose)',
        'polio3': 'Polio (3rd dose)',
        'rotavirus': 'Rotavirus (last dose)',
        'rubella1': 'Rubella (1st dose)',
    }
    
    for row in sparql_results:
        year = row['year']
        available_years.add(year)
        
        # Skip if filtering by year
        if filter_year and year != filter_year:
            continue
        
        # Process disease cases
        for metric_id, label in DISEASE_METRICS.items():
            if row.get(metric_id):
                disease_metrics.append({
                    'id': metric_id,
                    'label': label,
                    'value': int(row[metric_id]),
                    'year': year,
                    'category': 'disease'
                })
        
        # Process vaccination coverage
        for metric_id, label in VACCINATION_METRICS.items():
            if row.get(metric_id):
                vaccination_metrics.append({
                    'id': metric_id,
                    'label': label,
                    'value': int(row[metric_id]),
                    'year': year,
                    'unit': 'children',
                    'category': 'vaccination'
                })
        
        # Process population
        if row.get('populationAge0'):
            population_metrics.append({
                'id': 'populationAge0',
                'label': 'Population Age 0',
                'value': int(row['populationAge0']),
                'year': year,
                'unit': 'children',
                'category': 'population'
            })
    
    return {
        'diseaseCases': disease_metrics,
        'vaccinationCoverage': vaccination_metrics,
        'population': population_metrics,
        'availableYears': sorted(list(available_years), reverse=True)
    }
```

### Frontend Implementation

**TypeScript Types:**
```typescript
export interface HealthMetrics {
  diseaseCases: HealthMetricItem[];
  vaccinationCoverage: HealthMetricItem[];
  population: HealthMetricItem[];
  availableYears: number[]; // Sorted descending
}

export interface HealthMetricItem {
  id: string;
  label: string;
  value: number;
  year: number;
  unit?: string;
  category: 'disease' | 'vaccination' | 'population';
}
```

**InfoBoxSheet Features:**
- ✅ Year selector dropdown (purple theme)
- ✅ Client-side filtering by selected year
- ✅ Display health metrics by category (Disease/Vaccination/Population)
- ✅ Card-based responsive grid layout
- ✅ Fullscreen mode untuk better viewing
- ✅ Number formatting dengan locale
- ✅ Auto-select tahun terbaru sebagai default

**Mock Data:**
Mock service include data 3 tahun (2020, 2019, 2018) untuk testing:
- Disease cases: HIV, Malaria, TB, Rabies, Cholera (5 metrics × 3 years)
- Vaccination: BCG, DTP3, HepB3, Hib3, Measles1, Polio3, Rotavirus, Rubella1 (8 metrics × 3 years)
- Population: Age 0 data (1 metric × 3 years)

### Testing Checklist

**Backend API Tests:**
- [ ] Query returns all years of data (not just 1 year)
- [ ] availableYears array sorted descending
- [ ] Each metric includes year field
- [ ] Response matches TypeScript interface
- [ ] Filter by year works (optional)
- [ ] Handle missing data gracefully

**Frontend Tests:**
- [ ] Year selector dropdown appears
- [ ] Default year = availableYears[0]
- [ ] Dropdown shows all available years
- [ ] Selecting year updates all metrics
- [ ] Disease Cases section updates
- [ ] Vaccination Coverage section updates
- [ ] Population Data section updates
- [ ] No API call when switching years (client-side filter)

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
- [ ] Displays all sections (header, image, description, attributes, health metrics, related, sources)
- [ ] Expand button works (400px → 60vw)
- [ ] Collapse button works (60vw → 400px)
- [ ] Fullscreen button works (100vw)
- [ ] Exit fullscreen works
- [ ] Health metrics display by category (Disease/Vaccination/Population)
- [ ] Health metrics cards show value, year, unit
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

### Complete API Checklist for Backend

#### Core APIs (Must Implement)
- [ ] **GET /api/search** - Search entities with pagination
- [ ] **GET /api/search/suggestions** - Autocomplete suggestions
- [ ] **GET /api/entity/{entityId}** - Get entity detail with health metrics
- [ ] **GET /api/map/countries** - Get all countries with coordinates

#### Health Metrics APIs (New - High Priority)
- [ ] **GET /api/entity/{entityId}/health-metrics** - Get health metrics only
- [ ] **GET /api/entity/{entityId}/health-metrics/timeseries** - Time series data (Future)

**📄 See `HEALTH_METRICS_API.md` for complete health metrics documentation**

#### Enhanced APIs (Medium Priority)
- [ ] **GET /api/entity/by-label** - Get entity by label string
- [ ] **GET /api/entity/related** - Get related entities
- [ ] **POST /api/sparql/query** - Execute SPARQL queries
- [ ] **GET /api/sparql/samples** - Get sample queries
- [ ] **GET /api/map/countries/{iso3Code}** - Get country by ISO code

#### Optional APIs (Nice to Have)
- [ ] **POST /api/sparql/validate** - Validate SPARQL syntax
- [ ] **GET /api/sparql/history** - Get query history
- [ ] **POST /api/sparql/history** - Save query to history

### Priority Order
1. **High Priority** (Required for core functionality):
   - GET /api/search
   - GET /api/search/suggestions
   - GET /api/entity/{entityId} (with health metrics)
   - GET /api/map/countries
   - GET /api/entity/{entityId}/health-metrics

2. **Medium Priority** (Enhances experience):
   - GET /api/entity/by-label
   - GET /api/entity/related
   - POST /api/sparql/query
   - GET /api/sparql/samples

3. **Low Priority** (Nice to have):
   - POST /api/sparql/validate
   - GET /api/sparql/history
   - POST /api/sparql/history
   - GET /api/entity/{entityId}/health-metrics/timeseries

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
