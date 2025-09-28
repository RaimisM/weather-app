import { el, notify } from '../core/utility';
import { PAGE_SIZE } from '../core/config';
import { niceTimeFrom, weatherIconUrl } from '../core/weather-utils';
import { saveToLocal } from '../services/storage';
import { fetchWeatherFor } from '../api/weather-api';
import { forecastList, paginationList, prevPageBtn, nextPageBtn } from './dom-elements';
import type { SavedForecast } from '../core/types';

export function renderForecastCard(
  sf: SavedForecast,
  savedForecasts: SavedForecast[],
  renderCallback: () => void,
) {
  const data = sf.data;
  const weather0 = data?.weather?.[0];

  const card = el('div', { class: 'card' });
  const content = el('div', { class: 'card-content' });

  const media = el(
    'div',
    { class: 'media' },
    el(
      'div',
      { class: 'media-left' },
      data && weather0
        ? el(
            'figure',
            { class: 'image is-48x48' },
            el('img', {
              class: 'weather-icon',
              src: weatherIconUrl(weather0.icon ?? '01d'),
              alt: weather0.description ?? '',
            }),
          )
        : el('div', {}, '—'),
    ),
    el(
      'div',
      { class: 'media-content' },
      el(
        'p',
        { class: 'title is-5' },
        data ? `${data.name ?? sf.query}, ${data.sys?.country ?? ''}` : sf.query,
      ),
      el(
        'p',
        { class: 'subtitle is-6' },
        data
          ? `${weather0?.main ?? ''}${weather0?.description ? ' — ' + weather0.description : ''}`
          : '',
      ),
    ),
  );

  const table = el('div', { class: 'content' });
  if (data) {
    const temp = typeof data.main?.temp === 'number' ? `${data.main!.temp.toFixed(1)} °C` : '—';
    const humidity = typeof data.main?.humidity === 'number' ? `${data.main!.humidity}%` : '—';
    const wind = typeof data.wind?.speed === 'number' ? `${data.wind!.speed} m/s` : '—';
    const pressure = typeof data.main?.pressure === 'number' ? `${data.main!.pressure} hPa` : '—';
    const sunrise = typeof data.sys?.sunrise === 'number' ? niceTimeFrom(data.sys!.sunrise) : '—';
    const sunset = typeof data.sys?.sunset === 'number' ? niceTimeFrom(data.sys!.sunset) : '—';
    const lastUpdated = sf.lastFetchedAt ? new Date(sf.lastFetchedAt).toLocaleString() : '—';

    const rows: [string, string][] = [
      ['Temperature', temp],
      ['Humidity', humidity],
      ['Wind', wind],
      ['Pressure', pressure],
      ['Sunrise', sunrise],
      ['Sunset', sunset],
      ['Last updated', lastUpdated],
    ];
    const tbody = el('tbody');
    rows.forEach(([k, v]) => tbody.appendChild(el('tr', {}, el('th', {}, k), el('td', {}, v))));
    table.appendChild(el('table', { class: 'table is-fullwidth is-striped' }, tbody));
  } else {
    table.appendChild(el('p', {}, 'No data. Click refresh or wait for auto-update.'));
  }

  const controls = el(
    'div',
    { class: 'level' },
    el(
      'div',
      { class: 'level-left' },
      el(
        'div',
        { class: 'level-item' },
        el(
          'button',
          {
            class: 'button is-small is-light',
            onclick: async () => {
              notify(`Refreshing ${sf.query}…`, 'is-info');
              const res = await fetchWeatherFor(sf, savedForecasts);
              if (res) {
                notify(`Updated ${sf.query}`, 'is-success');
                renderCallback();
              }
            },
          },
          el('span', { class: 'icon' }, el('i', { class: 'fa fa-sync' })),
          el('span', {}, 'Refresh'),
        ),
      ),
    ),
    el(
      'div',
      { class: 'level-right' },
      el(
        'div',
        { class: 'level-item' },
        el(
          'button',
          {
            class: 'button is-danger is-light is-small',
            onclick: () => {
              const index = savedForecasts.findIndex((s) => s.id === sf.id);
              if (index !== -1) {
                savedForecasts.splice(index, 1);
                saveToLocal(savedForecasts);
                notify(`Removed ${sf.query}`, 'is-warning');
                renderCallback();
              }
            },
          },
          el('span', { class: 'icon' }, el('i', { class: 'fa fa-trash' })),
          el('span', {}, 'Remove'),
        ),
      ),
    ),
  );

  content.appendChild(media);
  content.appendChild(table);
  content.appendChild(controls);
  card.appendChild(content);
  return card;
}

export function renderPagination(
  filteredForecasts: SavedForecast[],
  currentPage: number,
  onPageChange: (page: number) => void,
) {
  const total = Math.ceil(filteredForecasts.length / PAGE_SIZE);

  const pagination = document.querySelector('.pagination') as HTMLElement;
  if (!pagination) return;

  if (total <= 1) {
    pagination.style.display = 'none';
    return;
  } else {
    pagination.style.display = 'flex';
  }

  paginationList.innerHTML = '';
  for (let i = 1; i <= total; i++) {
    paginationList.appendChild(
      el(
        'li',
        {},
        el(
          'a',
          {
            class: `pagination-link ${i === currentPage ? 'is-current' : ''}`,
            onclick: () => onPageChange(i),
          },
          String(i),
        ),
      ),
    );
  }

  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= total;
}

export function renderForecastList(
  filteredForecasts: SavedForecast[],
  currentPage: number,
  savedForecasts: SavedForecast[],
  renderCallback: () => void,
) {
  forecastList.innerHTML = '';
  if (!filteredForecasts.length) {
    forecastList.appendChild(el('p', {}, 'No forecasts yet. Click "Add Location" to add one.'));
    return;
  }
  const start = (currentPage - 1) * PAGE_SIZE;
  filteredForecasts
    .slice(start, start + PAGE_SIZE)
    .forEach((sf) =>
      forecastList.appendChild(renderForecastCard(sf, savedForecasts, renderCallback)),
    );
}
