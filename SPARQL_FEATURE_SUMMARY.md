# SPARQL Query Feature - Implementation Summary

## Overview
SPARQL Query Console telah ditambahkan ke aplikasi Knowledge Graph Health Data Explorer. Fitur ini memungkinkan pengguna untuk menjalankan query SPARQL secara langsung terhadap Knowledge Graph endpoint.

## Files Created

### 1. Types & Interfaces
- **`src/types/index.ts`** (updated)
  - `SPARQLQueryRequest`: Request payload untuk query execution
  - `SPARQLQueryResponse`: Response format (SPARQL JSON)
  - `SPARQLBinding`: Binding untuk hasil query
  - `SPARQLValue`: Value types (uri, literal, bnode)
  - `QueryHistory`: History tracking

### 2. Services
- **`src/services/sparql.service.ts`**
  - `ISPARQLService`: Interface definition
  - `SPARQLService`: Implementation dengan dependency injection
  - Methods:
    - `executeQuery()`: Execute SPARQL query
    - `validateQuery()`: Validate syntax
    - `getSampleQueries()`: Get sample queries
    - `getQueryHistory()`: Get execution history
    - `saveQueryToHistory()`: Save to history

### 3. Custom Hooks
- **`src/hooks/useSPARQLQuery.ts`**
  - Manages query execution state
  - Tracks execution time
  - Auto-saves to history
  
- **`src/hooks/useSampleQueries.ts`**
  - Loads sample queries from backend
  - Fallback to default samples if API unavailable

### 4. Components

#### Navbar (`src/components/Navbar/`)
- Navigation bar dengan routing
- Active state indication
- Responsive design

#### QueryEditor (`src/components/QueryEditor/`)
- SPARQL query text editor
- Sample queries dropdown
- Keyboard shortcuts (Ctrl+Enter to execute)
- Tab support
- Line/character counter

#### QueryResults (`src/components/QueryResults/`)
- Table visualization dengan pagination
- URI linking
- Execution time display
- CSV export functionality
- Empty/Loading/Error states

### 5. Pages

#### HomePage (`src/pages/HomePage/`)
- Search + Map page (existing features)
- Hero section dengan gradient background
- Integrated search dan map components

#### QueryPage (`src/pages/QueryPage/`)
- SPARQL Query Console
- Integrates QueryEditor + QueryResults
- Gradient header dengan tips/info cards

### 6. Routing
- **`src/App.tsx`** (updated)
  - React Router integration
  - Routes: `/` (Home) dan `/query` (SPARQL)

## Backend API Endpoints Required

Backend developer perlu implement endpoints berikut:

### 1. Execute Query
```
POST /api/sparql/query
Body: { query: string, format?: string, limit?: number }
Response: SPARQL JSON format
```

### 2. Validate Query
```
POST /api/sparql/validate
Body: { query: string }
Response: { valid: boolean, error?: string }
```

### 3. Sample Queries
```
GET /api/sparql/samples
Response: { queries: string[] }
```

### 4. Query History
```
GET /api/sparql/history
Response: { history: QueryHistory[] }

POST /api/sparql/history
Body: { query, executionTime, resultCount, timestamp }
Response: { success: boolean, id: string }
```

## Environment Variables

Tambahkan ke `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_SPARQL_QUERY=true
```

## Features Implemented

✅ **Query Editor**
- Syntax-aware textarea
- Tab support
- Line counting
- Keyboard shortcuts

✅ **Sample Queries**
- Dropdown dengan predefined queries
- One-click load
- Fallback jika API gagal

✅ **Query Execution**
- Execute dengan button atau Ctrl+Enter
- Loading state indication
- Execution time tracking
- Auto-save to history

✅ **Results Display**
- Table format dengan header sticky
- Pagination (50 results per page)
- URI clickable dengan external link
- Row numbers

✅ **Export Functionality**
- CSV export
- Includes all results

✅ **Navigation**
- Navbar dengan routing
- Active route indication
- Responsive mobile menu

✅ **Clean Code & SOLID**
- Service layer dengan interfaces
- Dependency injection
- Single Responsibility Principle
- Interface Segregation Principle
- Dependency Inversion Principle

## Usage Instructions

### For Users:
1. Navigate to "SPARQL Query" di navbar
2. Type SPARQL query atau pilih dari "Sample Queries"
3. Click "Execute" atau press Ctrl+Enter
4. View results di table
5. Export to CSV jika diperlukan

### For Developers:
1. Check `API_DOCUMENTATION.md` untuk backend API specs
2. Implement 5 SPARQL endpoints (execute, validate, samples, history GET/POST)
3. Return data dalam SPARQL JSON format
4. Test dengan sample queries provided

## Design Patterns Applied

1. **Service Layer Pattern**: Separation of concerns
2. **Dependency Injection**: Loose coupling via interfaces
3. **Custom Hooks**: Reusable stateful logic
4. **Composition**: Small, focused components
5. **Single Responsibility**: Each module has one job

## Testing Checklist

- [ ] Query execution dengan valid SPARQL
- [ ] Query validation dengan invalid syntax
- [ ] Sample queries loading
- [ ] Pagination dengan large result sets
- [ ] CSV export functionality
- [ ] History tracking
- [ ] Keyboard shortcuts (Ctrl+Enter)
- [ ] Responsive design (mobile/tablet)
- [ ] Error handling (network failures)
- [ ] Loading states

## Next Steps

1. **Backend Implementation**
   - Setup SPARQL endpoint
   - Implement 5 API endpoints
   - Connect to RDF triplestore

2. **Future Enhancements**
   - Syntax highlighting untuk SPARQL
   - Query builder GUI
   - Result visualization (charts/graphs)
   - Query templates by category
   - Collaborative query sharing
   - Query optimization suggestions

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│              React Router                    │
│  ┌─────────────┐      ┌─────────────────┐  │
│  │  HomePage   │      │   QueryPage     │  │
│  │  (Search)   │      │   (SPARQL)      │  │
│  └─────────────┘      └─────────────────┘  │
└─────────────────────────────────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│  Search Service  │    │  SPARQL Service  │
│  (existing)      │    │  (new)           │
└──────────────────┘    └──────────────────┘
           │                      │
           └──────────┬───────────┘
                      ▼
              ┌──────────────┐
              │ HTTP Client  │
              │ (Axios)      │
              └──────────────┘
                      │
                      ▼
              ┌──────────────┐
              │Backend API   │
              │(Port 3000)   │
              └──────────────┘
```

## Clean Code Principles Applied

1. **Meaningful Names**: Services, hooks, components have clear names
2. **Small Functions**: Each function does one thing
3. **DRY**: Reusable hooks and services
4. **Error Handling**: Try-catch blocks dengan user-friendly messages
5. **Comments**: JSDoc comments for all public APIs
6. **Separation of Concerns**: UI, logic, and data layers separated
7. **Type Safety**: Full TypeScript coverage

## Contact

Untuk pertanyaan tentang implementasi frontend SPARQL feature, lihat:
- `API_DOCUMENTATION.md` untuk backend specs
- `src/services/sparql.service.ts` untuk service implementation
- `src/pages/QueryPage/QueryPage.tsx` untuk UI integration
