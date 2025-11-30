/**
 * Configuration module following Single Responsibility Principle
 * Handles all application configuration from environment variables
 */

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    enableMap: boolean;
    enableSearch: boolean;
  };
}

class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): AppConfig {
    return {
      api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
      },
      features: {
        enableMap: import.meta.env.VITE_ENABLE_MAP === 'true',
        enableSearch: import.meta.env.VITE_ENABLE_SEARCH === 'true',
      },
    };
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public getApiBaseUrl(): string {
    return this.config.api.baseUrl;
  }

  public getApiTimeout(): number {
    return this.config.api.timeout;
  }

  public isMapEnabled(): boolean {
    return this.config.features.enableMap;
  }

  public isSearchEnabled(): boolean {
    return this.config.features.enableSearch;
  }
}

export const configService = ConfigService.getInstance();
export type { AppConfig };
