# Backend API Requirements - Quick Start Guide

## Overview
Frontend sudah siap! Sekarang backend perlu implement 5 endpoints untuk menghubungkan dengan Knowledge Graph RDF.

## Data Source
```
d:\Tugas\5_KG\TK\rdf\
├── entity.ttl          # Negara, region, organisasi (193+ negara)
├── property.ttl        # Definisi properties (HIV, malaria, BCG, dll)
└── health_record.ttl   # Data kesehatan per tahun dan lokasi
```

## Required API Endpoints

### 1. Search Entities
```
GET /api/search?query={string}&type={country|region|organization}&page={number}&pageSize={number}
```
**Return:** List entities yang match dengan query

**Example Response:**
```json
{
  "results": [
    { "id": "wd:Q252", "label": "Indonesia", "iso3Code": "IDN", "type": "country" }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10
}
```

### 2. Get Entity Detail
```
GET /api/entities/{id}
```
**Return:** Detail entity + health records + related entities

**Example Response:**
```json
{
  "entity": { "id": "wd:Q252", "label": "Indonesia", "iso3Code": "IDN", "type": "country" },
  "healthRecords": [
    { "year": 2020, "hivCases": 45000, "malariaCases": 120000, ... }
  ],
  "relatedEntities": [ { "id": "wd:Q11708", "label": "South-East Asia", "type": "region" } ]
}
```

### 3. Search Suggestions (Autocomplete)
```
GET /api/search/suggestions?query={string}
```
**Return:** Max 10 suggestions untuk autocomplete (minimum 2 characters)

**Example Response:**
```json
[
  { "id": "wd:Q252", "label": "Indonesia", "iso3Code": "IDN", "type": "country" },
  { "id": "wd:Q668", "label": "India", "iso3Code": "IND", "type": "country" }
]
```

### 4. Get All Country Coordinates
```
GET /api/map/countries
```
**Return:** Semua negara dengan koordinat geografis untuk map

**Example Response:**
```json
[
  { "iso3Code": "IDN", "label": "Indonesia", "latitude": -0.7893, "longitude": 113.9213 },
  { "iso3Code": "IND", "label": "India", "latitude": 20.5937, "longitude": 78.9629 }
]
```

**Note:** Reference koordinat ada di `src/data/country-coordinates.ts`

### 5. Get Country by ISO Code
```
GET /api/map/countries/{iso3Code}
```
**Return:** Entity detail untuk negara tertentu

**Example Response:**
```json
{
  "id": "wd:Q252",
  "label": "Indonesia",
  "iso3Code": "IDN",
  "type": "country"
}
```

## Implementation Steps

### Step 1: Setup RDF Parser
```bash
# Python example
pip install rdflib

# Node.js example
npm install n3 rdflib
```

### Step 2: Parse RDF Files
Parse ketiga file RDF untuk extract data:
- **entity.ttl**: Extract semua entities dengan rdfs:label dan wdt:P298 (ISO code)
- **health_record.ttl**: Extract health records dengan schema:year dan properties
- Build index untuk search yang cepat

### Step 3: Implement Search
- Full-text search pada entity labels
- Filter by type (country/region/organization)
- Support pagination
- Case-insensitive matching

### Step 4: Map ISO Codes to Coordinates
Gunakan reference data dari `src/data/country-coordinates.ts` atau create mapping sendiri.

### Step 5: Test with Frontend
```bash
# Start backend
python/node server.py/server.js

# Start frontend
cd fe-kg-gaung
npm run dev
```

## Entity Examples from RDF

### Countries
```turtle
wd:Q252 rdfs:label "Indonesia" ;
    wdt:P298 "IDN" .

wd:Q668 rdfs:label "India" ;
    wdt:P298 "IND" .
```

### Regions
```turtle
kge:HPD1 rdfs:label "East Asia & Pacific (WB)" .
wd:Q11708 rdfs:label "South-East Asia" .
```

### Health Records
```turtle
kgr:Q252_2020 a kgp:healthRecord ;
    kgp:hivCases 45000 ;
    kgp:malariaCases 120000 ;
    schema:location wd:Q252 ;
    schema:year "2020"^^xsd:gYear .
```

## Properties Available
- hivCases, malariaCases, rabiesCases, tuberculosisCases
- choleraCases, guineaworm, polioCases, smallpoxCases
- bcg, dtp3, hepb3, hib3, measles1, polio3, rotavirus, rubella1
- populationAge0

## Error Handling

Return proper HTTP status codes:
- 200: Success
- 400: Bad request (invalid parameters)
- 404: Not found
- 500: Server error

Error response format:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Performance Tips

1. **Cache parsed RDF data** - Parse once at startup
2. **Index entity labels** - Create search index
3. **Optimize queries** - Use SPARQL if possible
4. **Add pagination** - Don't return all results at once
5. **CORS headers** - Enable CORS untuk frontend development

## Testing

Test dengan curl:
```bash
# Search
curl "http://localhost:3000/api/search?query=indonesia"

# Get entity
curl "http://localhost:3000/api/entities/wd:Q252"

# Suggestions
curl "http://localhost:3000/api/search/suggestions?query=indo"

# Countries
curl "http://localhost:3000/api/map/countries"

# Country detail
curl "http://localhost:3000/api/map/countries/IDN"
```

## Tech Stack Recommendations

### Python
- FastAPI / Flask
- rdflib untuk RDF parsing
- CORS middleware

### Node.js
- Express / Fastify
- n3 / rdflib.js untuk RDF parsing
- cors middleware

### Java
- Spring Boot
- Apache Jena untuk RDF
- Spring CORS config

## Complete Documentation

Lihat **API_DOCUMENTATION.md** untuk:
- Request/response formats lengkap
- Error codes
- Data models
- Testing scenarios
- Future enhancements

## Questions?

Jika ada pertanyaan:
1. Check API_DOCUMENTATION.md
2. Check RDF files struktur
3. Check frontend types di `src/types/index.ts`
4. Contact frontend team

## Priority

High Priority (untuk basic functionality):
1. ✅ Search entities
2. ✅ Get country coordinates
3. ✅ Search suggestions

Medium Priority:
4. Get entity detail
5. Get country by ISO

Low Priority:
- Advanced filtering
- Sorting
- Aggregations

---

**Good luck! Frontend is ready and waiting! 🚀**
