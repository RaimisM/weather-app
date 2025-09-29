import { el, notify } from '../core/utility';
import { saveToLocal } from '../services/storage';
import { fetchWeatherFor } from '../api/weather-api';
import { PAGE_SIZE } from '../core/config';
import { addModal, addPreview, addSearch, addSaveBtn, globalSearch } from './dom-elements';
import type { SavedForecast } from '../core/types';

export function setupModalHandlers() {
  const addModalClose = document.getElementById('add-modal-close') as HTMLButtonElement;
  const addCancelBtn = document.getElementById('add-cancel') as HTMLButtonElement;
  const modalBackground = addModal.querySelector('.modal-background') as HTMLElement;

  const closeModal = () => addModal.classList.remove('is-active');

  addModalClose.addEventListener('click', closeModal);
  addCancelBtn.addEventListener('click', closeModal);
  modalBackground.addEventListener('click', closeModal);
}

export function handleAddLocation() {
  addModal.classList.add('is-active');
  addPreview.innerHTML = '';
  addSearch.value = '';
  addSaveBtn.disabled = true;
}

export async function handleSearchLocation() {
  const q = addSearch.value.trim();
  if (!q) {
    notify('Enter search query first', 'is-warning');
    return;
  }
  addPreview.innerHTML = '';
  addSaveBtn.disabled = true;
  notify('Searching…', 'is-info', 1500);

  const tmp: SavedForecast = { id: 'tmp', query: q, addedAt: Date.now() };
  const data = await fetchWeatherFor(tmp, []);
  if (!data) {
    addPreview.innerHTML = `
      <div class="notification is-danger">
        No results found. Try searching by:
        <ul>
          <li><strong>City name</strong> — e.g. <em>London</em></li>
          <li><strong>ZIP code</strong> — e.g. <em>zip:10001</em></li>
          <li><strong>Coordinates</strong> — e.g. <em>coord:59.9139,10.7522</em></li>
        </ul>
      </div>
    `;
    return;
  }

  const displayName = `${data.name ?? q}${data.sys?.country ? ', ' + data.sys.country : ''}`;
  const desc = data.weather?.[0]?.description ?? '';
  const box = el(
    'div',
    { class: 'box' },
    el('p', { class: 'title is-6' }, displayName),
    el(
      'p',
      {},
      `Temp: ${typeof data.main?.temp === 'number' ? data.main.temp.toFixed(1) : '—'} °C${
        desc ? ' — ' + desc : ''
      }`,
    ),
  );
  addPreview.appendChild(box);
  addSaveBtn.disabled = false;
  (addSaveBtn as any)._preview = { ...tmp, data };
}

export function handleSaveLocation(
  savedForecasts: SavedForecast[],
  renderCallback: () => void
) {
  const stored = (addSaveBtn as any)._preview as SavedForecast | undefined;
  if (!stored) {
    notify('Nothing to save', 'is-warning');
    return;
  }

  const exists = savedForecasts.some(sf => {
    const existingName = sf.data?.name ?? sf.query;
    const newName = stored.data?.name ?? stored.query;
    return existingName.trim().toLowerCase() === newName.trim().toLowerCase();
  });

  if (exists) {
    notify(`"${stored.query}" is already in your forecast list`, 'is-warning');
    return;
  }

  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  savedForecasts.push({
    ...stored,
    id,
    data: stored.data,
    lastFetchedAt: stored.lastFetchedAt,
  });
  saveToLocal(savedForecasts);
  addModal.classList.remove('is-active');
  notify(`Saved forecast for "${stored.query}"`, 'is-success');
  renderCallback();
}

export function handlePrevPage(
  currentPage: number,
  setCurrentPage: (page: number) => void,
  renderCallback: () => void
) {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
    renderCallback();
  }
}

export function handleNextPage(
  currentPage: number,
  filteredCount: number,
  setCurrentPage: (page: number) => void,
  renderCallback: () => void
) {
  const total = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  if (currentPage < total) {
    setCurrentPage(currentPage + 1);
    renderCallback();
  }
}

export function setupSearchDebounce(renderCallback: () => void) {
  let debounceTimer: number | undefined;

  globalSearch.addEventListener('input', () => {
    if (typeof debounceTimer === 'number') clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      renderCallback();
    }, 300) as unknown as number;
  });
}
