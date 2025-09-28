export interface WeatherData {
  name?: string;
  sys?: {
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  weather?: Array<{
    main?: string;
    description?: string;
    icon?: string;
  }>;
  main?: {
    temp?: number;
    humidity?: number;
    pressure?: number;
  };
  wind?: {
    speed?: number;
  };
}

export interface SavedForecast {
  id: string;
  query: string;
  addedAt: number;
  data?: WeatherData;
  lastFetchedAt?: number;
}
