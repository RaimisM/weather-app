import axios from 'axios';
import { notify } from '../core/utility';
import { API_KEY, WEATHER_API_URL } from '../core/config';
import { saveToLocal } from '../services/storage';
import type { SavedForecast, WeatherData } from '../core/types';

function buildOwmParams(query: string) {
  const q = query.trim();
  if (q.toLowerCase().startsWith('zip:')) {
    return {
      params: { zip: q.slice(4).trim(), appid: API_KEY, units: 'metric' },
    };
  }
  if (q.toLowerCase().startsWith('coord:')) {
    const [lat, lon] = q
      .slice(6)
      .split(',')
      .map((s) => s.trim());
    return { params: { lat, lon, appid: API_KEY, units: 'metric' } };
  }
  return { params: { q, appid: API_KEY, units: 'metric' } };
}

export async function fetchWeatherFor(
  sf: SavedForecast,
  savedForecasts: SavedForecast[],
): Promise<WeatherData | null> {
  try {
    const { data } = await axios.get<WeatherData>(WEATHER_API_URL, buildOwmParams(sf.query));
    sf.data = data;
    sf.lastFetchedAt = Date.now();
    saveToLocal(savedForecasts);
    return data;
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? err?.message ?? 'Unknown error';
    notify(`Failed to fetch "${sf.query}": ${msg}`, 'is-danger', 7000);
    return null;
  }
}

export async function refreshAllForecasts(savedForecasts: SavedForecast[]) {
  if (!savedForecasts.length) return;
  notify('Refreshing all saved forecasts…', 'is-info', 2000);
  await Promise.all(savedForecasts.map((sf) => fetchWeatherFor(sf, savedForecasts)));
  notify('All forecasts refreshed', 'is-success', 2000);
}
