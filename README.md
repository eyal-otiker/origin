# SoundApi

An Angular web application designed for searching and playing music tracks and DJ sets using the Mixcloud API.
The application features reactive and asynchronous state management, persistent search history, an embedded secure music player, and several unit tests.


## Architecture

* models/ (Interfaces & Data Models)
    * mix-cloud/ (Raw API Response)
    * track-result.model.ts (Normalized application track object)
    * search-response.model.ts (Unified search response interface)
* services/
    * mixcloud-api.service.ts (API requests & Data Mapping service)
    * search-state.service.ts (State management & history service)
* app.ts / app.html (Main root component - UI logic, animations & player)

## Key Features

* Smart Asynchronous Search: RxJS-based reactive search pipeline with `debounceTime` (300ms) to eliminate redundant API requests.
* Search History Management: Saves the last 5 searches in `localStorage`, preventing duplicates and automatically shifting re-searched terms to the top of the list.
* Flexible View Modes: Quick switching between List View and Tile View, persisting the user's preference across sessions.
* Embedded Media Player: Mixcloud Iframe player with URL sanitization via Angular's `DomSanitizer`.
* Pagination: Seamless navigation through search result pages using API-provided cursor pagination.

## Prerequisites

Before running the project, make sure you have the following installed:
* Node.js: v18.x or higher (`node -v`)
* npm: Comes bundled with Node (`npm -v`)
* Angular CLI (recommended): Install globally using `npm install -g @angular/cli`

## Donwload project from git

Open your terminal and run:
```bash
git clone <repository-url>
cd <project-folder>

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.
