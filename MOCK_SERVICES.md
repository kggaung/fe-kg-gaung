# Mock Services Configuration

## Overview
Mock services are currently **ENABLED** to allow frontend development without a backend.

## How It Works

All services have a `USE_MOCK` flag that toggles between mock and real API services:

### Files with Mock Toggle:

1. **`src/services/search.service.ts`**
   ```typescript
   const USE_MOCK = true;
   export const searchService = USE_MOCK ? mockSearchService : new SearchService(httpClient);
   ```

2. **`src/services/sparql.service.ts`**
   ```typescript
   const USE_MOCK = true;
   export const sparqlService = USE_MOCK ? mockSPARQLService : new SPARQLService(httpClient);
   ```

3. **`src/services/infobox.service.ts`**
   ```typescript
   const USE_MOCK = true;
   export const infoBoxService = USE_MOCK ? mockInfoBoxService : new InfoBoxService(httpClient);
   ```

## Switching to Real Backend

When backend is ready, change `USE_MOCK` to `false` in each service file:

```typescript
const USE_MOCK = false; // Change this to use real backend
```

## Mock Data Available

### Search Service (`search.service.mock.ts`)
- **20+ countries**: Indonesia, India, Brazil, USA, China, etc.
- **2 regions**: South-East Asia, South Asia
- **1 organization**: World Health Organization
- Search by name (case-insensitive)
- Pagination support

### InfoBox Service (`infobox.service.mock.ts`)
- **Detailed entities**:
  - **Indonesia**: Population, capital, area, inception date
  - **India**: Population, capital, area
  - **Brazil**: Population, capital
  - **South-East Asia**: Population, related countries
- **Attributes**: ISO codes, populations, capitals, dates
- **Related entities**: Regions, organizations, cities
- **Sources**: Wikidata links

### SPARQL Service (`sparql.service.mock.ts`)
- **Sample queries**: List countries, countries with population
- **Mock results**: 5 countries with population data
- **Query history**: Tracks executed queries
- **Validation**: Basic query validation

## Features Working with Mock Data

✅ **Search & Results**
- Type to search countries/regions/organizations
- Pagination (10 results per page)
- Click results to open InfoBox sheet

✅ **World Map**
- Click country markers to open InfoBox sheet
- Zoom in/out (markers scale dynamically)

✅ **InfoBox Sheet**
- Right-side expandable panel
- Expand/collapse button (400px ↔ 60% viewport)
- Shows attributes, related entities, sources
- Click related entities to navigate

✅ **SPARQL Query Console**
- Sample queries dropdown
- Execute queries (mock results)
- Results table with pagination
- CSV export

## Testing the Application

1. **Start dev server** (already running):
   ```bash
   npm run dev
   ```

2. **Open browser**: http://localhost:5173/

3. **Try features**:
   - Search "indonesia" → Click result → InfoBox opens
   - Click map marker → InfoBox opens
   - Click "Query in SPARQL Console" button
   - Expand/collapse InfoBox with arrow buttons
   - Click related entities to navigate

## Mock vs Real Differences

| Feature | Mock | Real Backend |
|---------|------|-------------|
| Network delay | Simulated (200-800ms) | Actual API latency |
| Data | Hardcoded 20+ entities | Full RDF database |
| SPARQL | Fixed results | Real query execution |
| Search | String matching | Full-text search |
| Images | Wikipedia URLs | Actual entity images |

## Next Steps for Backend Developer

When backend is ready:

1. Set `USE_MOCK = false` in all 3 service files
2. Ensure backend API matches endpoints in `API_DOCUMENTATION.md`
3. Test each feature with real data
4. Verify response formats match TypeScript interfaces

## Environment Variables

Make sure `.env` has correct backend URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

Change this when backend is deployed to production.
