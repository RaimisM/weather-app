# 🌦️ Weather App

A single-page **weather forecast application** built with **TypeScript** and **Vite**.  
This app uses the [OpenWeatherMap Current Weather Data API](https://openweathermap.org/current) to fetch real-time weather information.  
The design is styled with [Bulma.io](https://bulma.io/) for a minimal, clean, and responsive UI.

---

## ✨ Features

- 🔍 **Search & Add Forecasts**  
  Add new weather forecasts by city name, ZIP code, or coordinates via a modal search form.  
- 💾 **Persistent Storage**  
  Saved forecasts are stored in **LocalStorage** and automatically restored on page load.  
- 🗑️ **Remove Forecasts**  
  Easily delete forecasts with a single click.  
- 📑 **Pagination**  
  Forecasts are displayed in pages of **10 records per page**.  
- 🔎 **Search Through Added Forecasts**  
  Main page search bar filters saved forecasts instantly.  
- 🌡️ **Weather Details**  
  Each forecast card displays:
  - City + Country
  - Temperature
  - Humidity
  - Wind Speed
  - Pressure
  - Sunrise & Sunset times
  - Weather condition icon  
- 🔔 **Notifications**  
  All successful and failed actions (API errors, add/remove actions) show user-friendly notifications.  
- ♻️ **Auto Updates**  
  Forecast data is refreshed periodically without reloading the page.  

---

## 🛠️ Tech Stack

- **Frontend Framework**: [Vite](https://vitejs.dev/) + [Vue 3](https://vuejs.org/) + TypeScript  
- **UI Framework**: [Bulma.io](https://bulma.io/)  
- **HTTP Client**: [Axios](https://axios-http.com/)  
- **Local Server**: [http-server](https://www.npmjs.com/package/http-server)  

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/RaimisM/weather-app.git
cd weather-app
npm install
```
---

## 🚀 Development

Start the development server:

```bash
npm run dev
```

Open in browser: [http://localhost:5173](http://localhost:5173)

## 📦 Build

Build the project for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```
---

## Project Structure

```bash
Weather-App
├── src
│   ├── App.vue
│   ├── main.ts
│   ├── vite-env.ts
│   ├── api
│   │   └── weather-api.ts
│   ├── assets
│   │   └── style.css
│   ├── core
│   │   ├── config.ts
│   │   ├── types.ts
│   │   ├── utility.ts
│   │   └── weather-utils.ts
│   ├── services
│   │   ├── filtering.ts
│   │   └── storage.ts
│   ├── ui
│   │   ├── dom-elements.ts
│   │   ├── event-handlers.ts
│   │   └── rendering.ts
├── .env
├── index.html
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```
