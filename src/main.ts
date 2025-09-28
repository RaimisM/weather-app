import { notify } from './core/utility';
import { loadFromLocal } from './services/storage';
import { fetchWeatherFor, refreshAllForecasts } from './api/weather-api';
import { renderForecastList, renderPagination } from './ui/rendering';
import { applyFilter } from './services/filtering';
import { PAGE_SIZE, AUTO_REFRESH_MS } from './core/config';
import {
  btnAdd,
  addSaveBtn,
  performSearchBtn,
  prevPageBtn,
  nextPageBtn,
  globalSearch,
} from './ui/dom-elements';
import {
  setupModalHandlers,
  handleAddLocation,
  handleSearchLocation,
  handleSaveLocation,
  handlePrevPage,
  handleNextPage,
  setupSearchDebounce,
} from './ui/event-handlers';
import type { SavedForecast } from './core/types';

let saved: SavedForecast[] = [];
let filtered: SavedForecast[] = [];
let currentPage = 1;

function setCurrentPage(page: number) {
  currentPage = page;
}

function render() {
  filtered = applyFilter(saved, globalSearch.value ?? '');

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (currentPage > totalPages) currentPage = 1;

  renderForecastList(filtered, currentPage, saved, render);

  if (filtered.length > PAGE_SIZE) {
    renderPagination(filtered, currentPage, (page) => {
      currentPage = page;
      render();
    });
  } else {
    const pagination = document.querySelector('.pagination') as HTMLElement;
    if (pagination) pagination.style.display = 'none';
  }
}

function setupEventListeners() {
  setupModalHandlers();

  btnAdd.addEventListener('click', handleAddLocation);
  performSearchBtn.addEventListener('click', handleSearchLocation);
  addSaveBtn.addEventListener('click', () => handleSaveLocation(saved, render));

  prevPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handlePrevPage(currentPage, setCurrentPage, render);
  });

  nextPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleNextPage(currentPage, filtered.length, setCurrentPage, render);
  });

  setupSearchDebounce(() => {
    currentPage = 1;
    render();
  });
}

async function init() {
  saved = loadFromLocal();
  setupEventListeners();
  render();

  if (saved.length) {
    notify('Fetching latest forecasts…', 'is-info');
    await Promise.all(saved.map((sf) => fetchWeatherFor(sf, saved)));
    notify('Latest forecasts loaded', 'is-success', 1500);
    render();
  }

  setInterval(() => refreshAllForecasts(saved).then(() => render()), AUTO_REFRESH_MS);
}

init();
