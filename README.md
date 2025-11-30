# Knowledge Graph Health Data Explorer - Frontend

Frontend aplikasi untuk mengeksplorasi data kesehatan global menggunakan Knowledge Graph berbasis RDF.

## 🚀 Fitur

### ✅ Implemented
- **Search Functionality**: Pencarian entitas dalam Knowledge Graph dengan autocomplete
- **Interactive Map**: Peta dunia interaktif dengan marker untuk setiap negara
- **Responsive Design**: Desain yang responsif dan mobile-friendly
- **Clean Architecture**: Implementasi menggunakan SOLID principles dan clean code
- **Service Layer**: Abstraksi API dengan dependency injection
- **Type Safety**: Full TypeScript support

### 🔄 Upcoming (Need Backend Implementation)
- Info box untuk detail negara di map
- Detail page untuk entitas
- Filter dan sorting
- Data visualization charts

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Backend API (lihat API_DOCUMENTATION.md)

## 🛠️ Installation

1. Install dependencies
```bash
npm install
```

2. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` sesuai kebutuhan:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## 🔌 Backend Integration

Aplikasi ini membutuhkan backend API. Lihat **API_DOCUMENTATION.md** untuk detail endpoints yang perlu diimplementasikan.

### Backend TODO List

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
