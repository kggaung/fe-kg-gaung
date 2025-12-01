/**
 * Mock InfoBox Service
 * Provides mock data for development without backend
 */

import type { EntityInfo } from '../types';

const mockEntities: Record<string, EntityInfo> = {
  'Indonesia': {
    id: 'wd:Q252',
    label: 'Indonesia',
    type: 'country',
    description: 'Country in Southeast Asia and Oceania between the Indian and Pacific oceans. It consists of over 17,000 islands, including Sumatra, Java, Sulawesi, and parts of Borneo and New Guinea.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/320px-Flag_of_Indonesia.svg.png',
    attributes: [
      {
        property: 'P298',
        propertyLabel: 'ISO 3166-1 alpha-3 code',
        value: 'IDN',
        valueType: 'string',
      },
      {
        property: 'P1082',
        propertyLabel: 'Population',
        value: '273523615',
        valueType: 'number',
        unit: 'inhabitants',
      },
      {
        property: 'P36',
        propertyLabel: 'Capital',
        value: 'wd:Q3630',
        valueLabel: 'Jakarta',
        valueType: 'entity',
      },
      {
        property: 'P571',
        propertyLabel: 'Inception',
        value: '1945-08-17',
        valueType: 'date',
      },
      {
        property: 'P2046',
        propertyLabel: 'Area',
        value: '1904569',
        valueType: 'number',
        unit: 'km²',
      },
    ],
    healthMetrics: {
      diseaseCases: [
        // 2020 data
        { id: 'hivCases', label: 'HIV/AIDS Cases', value: 45000, year: 2020, category: 'disease' },
        { id: 'malariaCases', label: 'Malaria Cases', value: 120000, year: 2020, category: 'disease' },
        { id: 'tuberculosisCases', label: 'Tuberculosis Cases', value: 845000, year: 2020, category: 'disease' },
        { id: 'rabiesCases', label: 'Rabies Cases', value: 150, year: 2020, category: 'disease' },
        { id: 'choleraCases', label: 'Cholera Cases', value: 320, year: 2020, category: 'disease' },
        // 2019 data
        { id: 'hivCases', label: 'HIV/AIDS Cases', value: 43500, year: 2019, category: 'disease' },
        { id: 'malariaCases', label: 'Malaria Cases', value: 135000, year: 2019, category: 'disease' },
        { id: 'tuberculosisCases', label: 'Tuberculosis Cases', value: 825000, year: 2019, category: 'disease' },
        { id: 'rabiesCases', label: 'Rabies Cases', value: 180, year: 2019, category: 'disease' },
        { id: 'choleraCases', label: 'Cholera Cases', value: 450, year: 2019, category: 'disease' },
        // 2018 data
        { id: 'hivCases', label: 'HIV/AIDS Cases', value: 42000, year: 2018, category: 'disease' },
        { id: 'malariaCases', label: 'Malaria Cases', value: 148000, year: 2018, category: 'disease' },
        { id: 'tuberculosisCases', label: 'Tuberculosis Cases', value: 810000, year: 2018, category: 'disease' },
        { id: 'rabiesCases', label: 'Rabies Cases', value: 200, year: 2018, category: 'disease' },
        { id: 'choleraCases', label: 'Cholera Cases', value: 580, year: 2018, category: 'disease' },
      ],
      vaccinationCoverage: [
        // 2020 data
        { id: 'bcg', label: 'BCG', value: 3250000, year: 2020, unit: 'children', category: 'vaccination' },
        { id: 'dtp3', label: 'DTP3', value: 3100000, year: 2020, unit: 'children', category: 'vaccination' },
        { id: 'hepb3', label: 'HepB3', value: 3080000, year: 2020, unit: 'children', category: 'vaccination' },
        { id: 'hib3', label: 'Hib3', value: 3100000, year: 2020, unit: 'children', category: 'vaccination' },
        { id: 'measles1', label: 'Measles (1st dose)', value: 2950000, year: 2020, unit: 'children', category: 'vaccination' },
        { id: 'polio3', label: 'Polio (3rd dose)', value: 3100000, year: 2020, unit: 'children', category: 'vaccination' },
        { id: 'rotavirus', label: 'Rotavirus (last dose)', value: 2800000, year: 2020, unit: 'children', category: 'vaccination' },
        { id: 'rubella1', label: 'Rubella (1st dose)', value: 2950000, year: 2020, unit: 'children', category: 'vaccination' },
        // 2019 data
        { id: 'bcg', label: 'BCG', value: 3200000, year: 2019, unit: 'children', category: 'vaccination' },
        { id: 'dtp3', label: 'DTP3', value: 3050000, year: 2019, unit: 'children', category: 'vaccination' },
        { id: 'hepb3', label: 'HepB3', value: 3030000, year: 2019, unit: 'children', category: 'vaccination' },
        { id: 'hib3', label: 'Hib3', value: 3050000, year: 2019, unit: 'children', category: 'vaccination' },
        { id: 'measles1', label: 'Measles (1st dose)', value: 2900000, year: 2019, unit: 'children', category: 'vaccination' },
        { id: 'polio3', label: 'Polio (3rd dose)', value: 3050000, year: 2019, unit: 'children', category: 'vaccination' },
        { id: 'rotavirus', label: 'Rotavirus (last dose)', value: 2750000, year: 2019, unit: 'children', category: 'vaccination' },
        { id: 'rubella1', label: 'Rubella (1st dose)', value: 2900000, year: 2019, unit: 'children', category: 'vaccination' },
        // 2018 data
        { id: 'bcg', label: 'BCG', value: 3150000, year: 2018, unit: 'children', category: 'vaccination' },
        { id: 'dtp3', label: 'DTP3', value: 3000000, year: 2018, unit: 'children', category: 'vaccination' },
        { id: 'hepb3', label: 'HepB3', value: 2980000, year: 2018, unit: 'children', category: 'vaccination' },
        { id: 'hib3', label: 'Hib3', value: 3000000, year: 2018, unit: 'children', category: 'vaccination' },
        { id: 'measles1', label: 'Measles (1st dose)', value: 2850000, year: 2018, unit: 'children', category: 'vaccination' },
        { id: 'polio3', label: 'Polio (3rd dose)', value: 3000000, year: 2018, unit: 'children', category: 'vaccination' },
        { id: 'rotavirus', label: 'Rotavirus (last dose)', value: 2700000, year: 2018, unit: 'children', category: 'vaccination' },
        { id: 'rubella1', label: 'Rubella (1st dose)', value: 2850000, year: 2018, unit: 'children', category: 'vaccination' },
      ],
      population: [
        { id: 'populationAge0', label: 'Population Age 0', value: 4650000, year: 2020, unit: 'children', category: 'population' },
        { id: 'populationAge0', label: 'Population Age 0', value: 4600000, year: 2019, unit: 'children', category: 'population' },
        { id: 'populationAge0', label: 'Population Age 0', value: 4550000, year: 2018, unit: 'children', category: 'population' },
      ],
      availableYears: [2020, 2019, 2018],
    },
    relatedEntities: [
      {
        id: 'wd:Q11708',
        label: 'South-East Asia',
        type: 'region',
        relationshipType: 'P361',
        relationshipLabel: 'part of',
        description: 'Subregion of Asia consisting of countries south of China, east of India, and north of Australia',
      },
      {
        id: 'wd:Q7159',
        label: 'World Health Organization',
        type: 'organization',
        relationshipType: 'P463',
        relationshipLabel: 'member of',
        description: 'Specialized agency of the United Nations responsible for international public health',
      },
      {
        id: 'wd:Q3630',
        label: 'Jakarta',
        type: 'country',
        relationshipType: 'P36',
        relationshipLabel: 'capital',
        description: 'Capital and largest city of Indonesia',
      },
    ],
    sources: [
      {
        name: 'Wikidata',
        url: 'https://www.wikidata.org/wiki/Q252',
        date: '2024',
      },
      {
        name: 'World Health Organization',
        url: 'https://www.who.int',
      },
    ],
  },
  'India': {
    id: 'wd:Q668',
    label: 'India',
    type: 'country',
    description: 'Country in South Asia, officially the Republic of India. It is the seventh-largest country by area and the most populous country in the world.',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/320px-Flag_of_India.svg.png',
    attributes: [
      {
        property: 'P298',
        propertyLabel: 'ISO 3166-1 alpha-3 code',
        value: 'IND',
        valueType: 'string',
      },
      {
        property: 'P1082',
        propertyLabel: 'Population',
        value: '1428627663',
        valueType: 'number',
        unit: 'inhabitants',
      },
      {
        property: 'P36',
        propertyLabel: 'Capital',
        value: 'wd:Q987',
        valueLabel: 'New Delhi',
        valueType: 'entity',
      },
      {
        property: 'P2046',
        propertyLabel: 'Area',
        value: '3287263',
        valueType: 'number',
        unit: 'km²',
      },
    ],
    relatedEntities: [
      {
        id: 'wd:Q865',
        label: 'South Asia',
        type: 'region',
        relationshipType: 'P361',
        relationshipLabel: 'part of',
        description: 'Southern region of the Asian continent',
      },
    ],
    sources: [
      {
        name: 'Wikidata',
        url: 'https://www.wikidata.org/wiki/Q668',
      },
    ],
  },
  'Brazil': {
    id: 'wd:Q155',
    label: 'Brazil',
    type: 'country',
    description: 'Largest country in South America and Latin America. Brazil is the world\'s fifth-largest country by area and the seventh most populous.',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Flag_of_Brazil.svg/320px-Flag_of_Brazil.svg.png',
    attributes: [
      {
        property: 'P298',
        propertyLabel: 'ISO 3166-1 alpha-3 code',
        value: 'BRA',
        valueType: 'string',
      },
      {
        property: 'P1082',
        propertyLabel: 'Population',
        value: '215313498',
        valueType: 'number',
        unit: 'inhabitants',
      },
      {
        property: 'P36',
        propertyLabel: 'Capital',
        value: 'wd:Q2844',
        valueLabel: 'Brasília',
        valueType: 'entity',
      },
    ],
    relatedEntities: [
      {
        id: 'wd:Q18',
        label: 'South America',
        type: 'region',
        relationshipType: 'P361',
        relationshipLabel: 'part of',
      },
    ],
    sources: [
      {
        name: 'Wikidata',
        url: 'https://www.wikidata.org/wiki/Q155',
      },
    ],
  },
  'wd:Q11708': {
    id: 'wd:Q11708',
    label: 'South-East Asia',
    type: 'region',
    description: 'Subregion of Asia consisting of countries that are geographically south of China, east of India, west of New Guinea, and north of Australia.',
    attributes: [
      {
        property: 'P31',
        propertyLabel: 'Instance of',
        value: 'Subregion',
        valueType: 'string',
      },
      {
        property: 'P1082',
        propertyLabel: 'Population',
        value: '685000000',
        valueType: 'number',
        unit: 'inhabitants',
      },
    ],
    relatedEntities: [
      {
        id: 'wd:Q252',
        label: 'Indonesia',
        type: 'country',
        relationshipType: 'P527',
        relationshipLabel: 'has part',
      },
      {
        id: 'wd:Q869',
        label: 'Thailand',
        type: 'country',
        relationshipType: 'P527',
        relationshipLabel: 'has part',
      },
    ],
    sources: [
      {
        name: 'Wikidata',
        url: 'https://www.wikidata.org/wiki/Q11708',
      },
    ],
  },
};

export class MockInfoBoxService {
  async getEntityInfo(entityId: string): Promise<EntityInfo> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const entity = mockEntities[entityId] || mockEntities['Indonesia'];
    return entity;
  }

  async getEntityByLabel(label: string): Promise<EntityInfo> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const entity = mockEntities[label] || mockEntities['Indonesia'];
    return entity;
  }

  async getRelatedEntities(entityId: string, limit = 10): Promise<EntityInfo[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const entity = mockEntities[entityId] || mockEntities['Indonesia'];
    return entity.relatedEntities.slice(0, limit).map(rel => {
      return mockEntities[rel.label] || {
        id: rel.id,
        label: rel.label,
        type: rel.type,
        description: rel.description,
        attributes: [],
        relatedEntities: [],
        sources: [],
      };
    });
  }
}

export const mockInfoBoxService = new MockInfoBoxService();
