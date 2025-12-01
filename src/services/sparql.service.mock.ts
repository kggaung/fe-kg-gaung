/**
 * Mock SPARQL Service
 * Provides mock SPARQL query results for development without backend
 */

import type { SPARQLQueryRequest, SPARQLQueryResponse, QueryHistory } from '../types';

const mockSampleQueries = [
  {
    id: '1',
    title: 'List all countries',
    query: `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?country ?label WHERE {
  ?country wdt:P31 wd:Q6256 .
  ?country rdfs:label ?label .
  FILTER(LANG(?label) = "en")
}
LIMIT 10`,
  },
  {
    id: '2',
    title: 'Countries with population',
    query: `PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?country ?label ?population WHERE {
  ?country wdt:P31 wd:Q6256 .
  ?country rdfs:label ?label .
  ?country wdt:P1082 ?population .
  FILTER(LANG(?label) = "en")
}
ORDER BY DESC(?population)
LIMIT 10`,
  },
];

const mockQueryResults: SPARQLQueryResponse = {
  head: {
    vars: ['country', 'label', 'population'],
  },
  results: {
    bindings: [
      {
        country: { type: 'uri', value: 'http://www.wikidata.org/entity/Q252' },
        label: { type: 'literal', value: 'Indonesia' },
        population: { type: 'literal', value: '273523615', datatype: 'http://www.w3.org/2001/XMLSchema#integer' },
      },
      {
        country: { type: 'uri', value: 'http://www.wikidata.org/entity/Q668' },
        label: { type: 'literal', value: 'India' },
        population: { type: 'literal', value: '1428627663', datatype: 'http://www.w3.org/2001/XMLSchema#integer' },
      },
      {
        country: { type: 'uri', value: 'http://www.wikidata.org/entity/Q155' },
        label: { type: 'literal', value: 'Brazil' },
        population: { type: 'literal', value: '215313498', datatype: 'http://www.w3.org/2001/XMLSchema#integer' },
      },
      {
        country: { type: 'uri', value: 'http://www.wikidata.org/entity/Q30' },
        label: { type: 'literal', value: 'United States' },
        population: { type: 'literal', value: '331893745', datatype: 'http://www.w3.org/2001/XMLSchema#integer' },
      },
      {
        country: { type: 'uri', value: 'http://www.wikidata.org/entity/Q148' },
        label: { type: 'literal', value: 'China' },
        population: { type: 'literal', value: '1412600000', datatype: 'http://www.w3.org/2001/XMLSchema#integer' },
      },
    ],
  },
};

export class MockSPARQLService {
  private queryHistory: QueryHistory[] = [];

  async executeQuery(request: SPARQLQueryRequest): Promise<SPARQLQueryResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Save to history
    const historyItem: QueryHistory = {
      id: Date.now().toString(),
      query: request.query,
      timestamp: new Date(),
      executionTime: 800,
      resultCount: mockQueryResults.results.bindings.length,
    };
    this.queryHistory.unshift(historyItem);

    return mockQueryResults;
  }

  async validateQuery(query: string): Promise<{ valid: boolean; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 200));

    // Simple validation - check if it contains SELECT
    if (!query.trim().toUpperCase().includes('SELECT')) {
      return { valid: false, message: 'Query must contain SELECT statement' };
    }

    return { valid: true };
  }

  async getSampleQueries(): Promise<Array<{ id: string; title: string; query: string }>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockSampleQueries;
  }

  async getQueryHistory(): Promise<QueryHistory[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.queryHistory;
  }

  async saveQueryToHistory(query: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const historyItem: QueryHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
    };
    this.queryHistory.unshift(historyItem);
  }
}

export const mockSPARQLService = new MockSPARQLService();
