import type { SavedForecast } from '../core/types';

export function applyFilter(savedForecasts: SavedForecast[], searchValue = ''): SavedForecast[] {
  const s = searchValue.trim().toLowerCase();
  if (!s) return [...savedForecasts];

  return savedForecasts.filter((sf) => {
    if (!sf.data) return sf.query.toLowerCase().includes(s);

    const q = sf.query ?? '';
    const name = sf.data?.name ?? '';
    const country = sf.data?.sys?.country ?? '';
    const desc = sf.data?.weather?.[0]?.description ?? '';
    const tempRounded =
      typeof sf.data?.main?.temp === 'number' ? Math.round(sf.data!.main!.temp).toString() : '';
    const check = [q, name, country, desc, tempRounded].map((v) => v.toLowerCase());
    return check.some((m) => m.includes(s));
  });
}
