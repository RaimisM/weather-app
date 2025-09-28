import { notify } from './utility';

export const API_KEY = import.meta.env.VITE_OWM_API_KEY;
if (!API_KEY) {
  window.setTimeout(() => {
    notify('Missing OpenWeatherMap API key. Set VITE_OWM_API_KEY in .env', 'is-danger', 0);
  }, 300);
}

export const STORAGE_KEY = 'saved_forecasts_v1';
export const PAGE_SIZE = 10;
export const AUTO_REFRESH_MS = 5 * 60 * 1000;

export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
export const WEATHER_ICON_BASE_URL = 'https://openweathermap.org/img/wn/';
