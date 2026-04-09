# Farm Management Web Application

A fully local, browser-based farm business management system built with React, CSS, JavaScript, and Chart.js. It uses `localStorage` for persistence and includes JSON export/import backup tools.

## Features

- Dashboard with summary cards and bar, pie, line, and doughnut charts
- Farm management for cow, poultry, goose, and field crop operations
- Inventory tracking for feed, seeds, fertilizer, and medicine
- Expense and income tracking with automatic profit calculation
- Reports with date and farm filters
- Manual JSON backup export and restore
- Auto-save to browser storage after every change
- Search, filters, dark/light mode, and local reminders
- Farm-related images loaded from Unsplash URLs with offline fallbacks

## Setup

1. Install Node.js 20 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite, usually `http://127.0.0.1:5173`.

## Local Data

All farms, inventory, expenses, income, reminders, and settings are saved in browser `localStorage` under `farm-manager-state-v1`. Data remains after refresh or browser restart on the same browser profile.

Use **Backup** in the app to download a JSON backup. Use **Restore** to import a previous JSON backup.

## Offline Behavior

Core features work offline because data is stored locally. Remote farm images may not load without internet access, but each image area has a local visual fallback.
