import { WEATHER_ICON_BASE_URL } from './config';

export const niceTimeFrom = (tsSec: number) => new Date(tsSec * 1000).toLocaleTimeString();

export const weatherIconUrl = (icon: string) => `${WEATHER_ICON_BASE_URL}${icon}@2x.png`;
