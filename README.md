# Knowledge Graph Health Data Explorer

> A modern web application for exploring global health data through an interactive Knowledge Graph interface

![React](https://img.shields.io/badge/React-19.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.4-purple) ![License](https://img.shields.io/badge/license-MIT-green)

## 📖 Overview

Knowledge Graph Health Data Explorer is an interactive web application that allows users to explore and analyze global health data using semantic web technologies. Built with React and TypeScript, it provides intuitive interfaces for searching entities, visualizing geographical data, and executing SPARQL queries against a Knowledge Graph powered by RDF.

## ✨ Features

### 🔍 Smart Search
- **Instant Search**: Real-time autocomplete with query suggestions
- **Type Filtering**: Filter by countries, regions, or organizations
- **Pagination**: Smooth navigation through large result sets
- **Deep Linking**: Click results to explore detailed entity information

### 🗺️ Interactive World Map
- **Dynamic Markers**: Country markers that scale with zoom level
- **Click-to-Explore**: Click any country to view detailed health data
- **Responsive Design**: Optimized for desktop and mobile devices
- **Visual Feedback**: Hover effects and interactive tooltips

### 📊 Info Box Panel
- **Slide-out Design**: Right-side expandable panel (400px ↔ 60% viewport)
- **Rich Information**: View attributes, related entities, and data sources
- **Entity Navigation**: Seamlessly navigate between related entities
- **Persistent Access**: Available across all pages in the application

### 💻 SPARQL Query Console
- **Query Editor**: Multi-line editor with syntax highlighting
- **Sample Queries**: Pre-built queries for common use cases
- **Results Table**: Paginated results with sortable columns
- **CSV Export**: Download query results for further analysis
- **Keyboard Shortcuts**: Ctrl+Enter to execute queries

### 🏗️ Clean Architecture
- **SOLID Principles**: Maintainable and extensible codebase
- **Dependency Injection**: Loose coupling with interface abstractions
- **Type Safety**: Full TypeScript coverage with strict mode
- **Mock Services**: Development mode without backend dependency

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fe-kg-gaung
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_API_TIMEOUT=30000
   VITE_ENABLE_MAP=true
   VITE_ENABLE_SEARCH=true
   VITE_ENABLE_SPARQL_QUERY=true
   VITE_ENABLE_INFO_BOX=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## 🎨 Application Structure

```
fe-kg-gaung/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── InfoBox/        # Entity detail panel
│   │   ├── Navbar/         # Navigation bar
│   │   ├── QueryEditor/    # SPARQL editor
│   │   ├── QueryResults/   # Query results table
│   │   ├── SearchBar/      # Search input with autocomplete
│   │   └── WorldMap/       # Interactive world map
│   ├── pages/              # Page components
│   │   ├── HomePage/       # Search + Map page
│   │   └── QueryPage/      # SPARQL Console page
│   ├── services/           # API service layer
│   │   ├── *.service.ts    # Real API services
│   │   └── *.service.mock.ts # Mock data providers
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── data/               # Static data (coordinates, etc.)
│   └── App.tsx             # Root component with routing
├── public/                 # Static assets
└── dist/                   # Production build output
```

## 🔧 Technology Stack

- **Frontend Framework**: React 19.2.0 with React Router
- **Language**: TypeScript 5.9.3 (strict mode)
- **Build Tool**: Vite 7.2.4
- **HTTP Client**: Axios
- **Map Library**: react-simple-maps
- **Styling**: Pure CSS with CSS Modules
- **State Management**: React Hooks (useState, useEffect, custom hooks)

## 📚 Usage Guide

### Search for Entities
1. Type in the search bar at the top of the home page
2. Select from autocomplete suggestions or press Enter
3. View results with type indicators (🌍 Country, 🌏 Region, 🏛️ Organization)
4. Click any result to open the Info Box panel

### Explore the Map
1. Pan and zoom the world map
2. Click country markers to view information
3. Markers scale dynamically with zoom level

### View Entity Details
1. Click search results or map markers to open Info Box
2. Expand panel with arrow button (◀/▶) for full view
3. Click related entities to navigate
4. View data sources with external links

### Run SPARQL Queries
1. Navigate to "Query Console" in the navbar
2. Select a sample query from the dropdown or write your own
3. Press Ctrl+Enter or click "Execute" button
4. View results in paginated table
5. Export to CSV for analysis

## 🧪 Development Mode

The application includes mock services for frontend development without a backend:

**Mock data available:**
- 20+ countries (Indonesia, India, Brazil, USA, China, etc.)
- 2 regions (South-East Asia, South Asia)
- 1 organization (World Health Organization)
- Sample SPARQL queries with results

**To switch between mock and real backend**, see `DEVELOPER.md`.

## 🤝 Contributing

For developers and contributors, please refer to `DEVELOPER.md` for:
- Backend API requirements
- Architecture details
- Development workflow
- Testing guidelines

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- RDF data sources from Wikidata
- Map data from Natural Earth
- Built with modern web technologies

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Made with ❤️ for global health data exploration**

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
