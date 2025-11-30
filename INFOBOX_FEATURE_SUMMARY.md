# Info Box Feature Implementation Summary

## Overview
The Info Box feature provides detailed entity information display similar to Google's knowledge panel. Users can click on search results to view comprehensive entity details, navigate to related entities, and explore the knowledge graph interactively.

## Architecture

### Clean Code & SOLID Principles Applied

1. **Single Responsibility Principle (SRP)**
   - `InfoBoxService`: Only handles entity information retrieval
   - `InfoBox` component: Only displays entity information
   - `EntityPage`: Only manages page-level state and routing

2. **Open/Closed Principle (OCP)**
   - Service interface allows extension without modification
   - Component design allows customization through props

3. **Liskov Substitution Principle (LSP)**
   - `InfoBoxService` implements `IInfoBoxService` interface
   - Can be replaced with mock implementations for testing

4. **Interface Segregation Principle (ISP)**
   - `IInfoBoxService` provides focused interface with only necessary methods
   - No client forced to depend on methods they don't use

5. **Dependency Inversion Principle (DIP)**
   - Depends on `IHttpClient` abstraction, not concrete implementation
   - Easy to swap HTTP client without changing service code

## File Structure

```
src/
├── types/
│   └── index.ts                    # Added EntityInfo, EntityAttribute, RelatedEntity types
├── services/
│   └── infobox.service.ts         # InfoBox service with IInfoBoxService interface
├── hooks/
│   └── useEntityInfo.ts           # Custom hook for entity info state management
├── components/
│   └── InfoBox/
│       ├── InfoBox.tsx            # Main InfoBox component
│       └── InfoBox.css            # Minimalist InfoBox styles
├── pages/
│   ├── HomePage/
│   │   └── HomePage.tsx           # Updated with click handler
│   └── EntityPage/
│       ├── EntityPage.tsx         # Entity detail page
│       └── EntityPage.css         # Entity page styles
└── App.tsx                        # Added /entity/:entityId route
```

## Type Definitions

### EntityInfo
```typescript
interface EntityInfo {
  id: string;
  label: string;
  type: EntityType;
  description?: string;
  image?: string;
  attributes: EntityAttribute[];
  relatedEntities: RelatedEntity[];
  sources?: EntitySource[];
}
```

### EntityAttribute
```typescript
interface EntityAttribute {
  property: string;
  propertyLabel: string;
  value: string;
  valueLabel?: string;
  valueType: 'string' | 'number' | 'date' | 'uri' | 'entity';
  unit?: string;
}
```

### RelatedEntity
```typescript
interface RelatedEntity {
  id: string;
  label: string;
  type: EntityType;
  relationshipType: string;
  relationshipLabel: string;
  description?: string;
}
```

## Service Layer

### IInfoBoxService Interface
```typescript
interface IInfoBoxService {
  getEntityInfo(entityId: string): Promise<EntityInfo>;
  getEntityByLabel(label: string): Promise<EntityInfo>;
  getRelatedEntities(entityId: string, limit?: number): Promise<EntityInfo[]>;
}
```

### Implementation
- Uses Dependency Injection with `IHttpClient`
- Error handling with try-catch
- URL encoding for entity IDs
- Singleton export pattern

## Components

### InfoBox Component
**Features:**
- Header with entity label and type badge
- Optional image display
- Description section
- Attributes grid with property-value pairs
- Related entities cards with navigation
- Sources section with external links
- Click handlers for entity navigation
- Value formatting (dates, numbers, URIs)

**Props:**
```typescript
interface InfoBoxProps {
  entityInfo: EntityInfo;
  onRelatedEntityClick?: (entityId: string) => void;
}
```

### EntityPage Component
**Features:**
- URL parameter handling (`:entityId`)
- Loading state with spinner
- Error state with retry option
- Empty state for not found
- Breadcrumb navigation
- Integration with InfoBox
- "Query in SPARQL Console" action button
- Related entity click navigation

## Routing

### New Route
```typescript
<Route path="/entity/:entityId" element={<EntityPage />} />
```

### Navigation Flow
1. User clicks search result → Navigate to `/entity/{entityId}`
2. User clicks related entity → Navigate to `/entity/{relatedEntityId}`
3. User clicks breadcrumb → Navigate back to `/`
4. User clicks SPARQL button → Navigate to `/query?entity={entityId}`

## Integration

### Search Results Integration
- Added `onResultClick` prop to `SearchResults`
- Implemented click handler in `HomePage`
- Navigation to entity page with encoded ID

### SPARQL Query Integration
- "Query in SPARQL Console" button
- Pre-fills entity ID as query parameter
- Allows exploration via SPARQL

## Backend API Requirements

### Endpoint 1: Get Entity Info Box
```
GET /api/entity/{entityId}
```
**Response:**
```json
{
  "entity": {
    "id": "wd:Q252",
    "label": "Indonesia",
    "type": "country",
    "description": "Country in Southeast Asia and Oceania",
    "image": "https://example.com/indonesia.jpg",
    "attributes": [
      {
        "property": "P298",
        "propertyLabel": "ISO 3166-1 alpha-3 code",
        "value": "IDN",
        "valueType": "string"
      }
    ],
    "relatedEntities": [
      {
        "id": "wd:Q11708",
        "label": "South-East Asia",
        "type": "region",
        "relationshipType": "P361",
        "relationshipLabel": "part of",
        "description": "Subregion of Asia"
      }
    ],
    "sources": [
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/wiki/Q252"
      }
    ]
  },
  "sparqlQuery": "SELECT ?p ?o WHERE { wd:Q252 ?p ?o }"
}
```

### Endpoint 2: Get Entity by Label
```
GET /api/entity/by-label?label={label}
```
Same response format as Endpoint 1.

### Endpoint 3: Get Related Entities
```
GET /api/entity/related?entityId={entityId}&limit={limit}
```
**Response:**
```json
{
  "entities": [
    {
      "id": "wd:Q11708",
      "label": "South-East Asia",
      "type": "region",
      "description": "Subregion of Asia",
      "attributes": [],
      "relatedEntities": [],
      "sources": []
    }
  ]
}
```

## Environment Variables

Added to `.env` and `.env.example`:
```
VITE_ENABLE_INFO_BOX=true
```

## UI/UX Features

### Design Elements
- Google-style info box design
- Gradient purple header
- Clean white content cards
- Responsive grid layouts
- Hover effects on interactive elements
- Loading states with spinners
- Error states with retry options

### Interactions
- Click search results to open info box
- Click related entities to navigate
- Click entity attributes (if entity type)
- Click sources to open external links
- Breadcrumb navigation
- SPARQL integration button

### Responsive Design
- Mobile-friendly layout
- Stacked grids on small screens
- Touch-friendly tap targets
- Readable font sizes

## Testing Checklist

- [ ] Click search result navigates to entity page
- [ ] Entity page loads and displays information
- [ ] Related entities are clickable and navigate correctly
- [ ] Breadcrumb navigation works
- [ ] SPARQL button navigates with entity parameter
- [ ] Loading state appears while fetching
- [ ] Error state appears on fetch failure
- [ ] Empty state appears for not found entities
- [ ] Image displays when available
- [ ] Attributes format correctly (dates, numbers)
- [ ] Sources link to external URLs
- [ ] Mobile responsive layout works
- [ ] URL encoding handles special characters

## Next Steps for Backend Developer

1. **Implement Entity Retrieval**
   - Parse RDF data for entity details
   - Extract labels, descriptions, types
   - Find entity images if available

2. **Implement Attributes Extraction**
   - Query entity properties
   - Format values by type
   - Include units where applicable
   - Map property IDs to labels

3. **Implement Related Entities**
   - Query entity relationships
   - Filter by relationship types
   - Include relationship labels
   - Limit results appropriately

4. **Implement Sources**
   - Track data sources
   - Include Wikidata links
   - Add timestamps if available

5. **Handle Edge Cases**
   - Entity not found → 404
   - Invalid entity ID → 400
   - Missing data → provide defaults
   - URL encoding/decoding

## Integration with Other Features

### Search Feature
- Click handler on search results
- Navigate to entity page
- Maintains search context in browser history

### SPARQL Query Feature
- "Query in SPARQL Console" button
- Pre-fill entity ID in query
- Allow free-form exploration

### Map Feature
- Future: Click country on map → open info box
- Show entity location if available

## Benefits

1. **User Experience**
   - Rich entity information display
   - Easy navigation between related entities
   - Intuitive Google-like interface
   - Seamless integration with search

2. **Code Quality**
   - SOLID principles applied
   - Clean separation of concerns
   - Testable architecture
   - Reusable components

3. **Maintainability**
   - Clear type definitions
   - Interface-based design
   - Consistent patterns
   - Well-documented code

4. **Extensibility**
   - Easy to add new entity types
   - Easy to add new attribute types
   - Easy to customize display
   - Easy to integrate new features
