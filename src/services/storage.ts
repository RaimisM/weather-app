import { notify } from '../core/utility';
import { STORAGE_KEY } from '../core/config';
import type { SavedForecast } from '../core/types';

export function saveToLocal(data: SavedForecast[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromLocal(): SavedForecast[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedForecast[]) : [];
  } catch {
    notify('Failed to read saved forecasts from localStorage', 'is-danger');
    return [];
  }
}
