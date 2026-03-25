# Maserati Quattroporte — 3D Car Configurator

An interactive 3D car configurator for the Maserati Quattroporte built with Angular 16 and Three.js. Users can customize the car in real time by selecting body paint colors, brake caliper colors, interior materials, and wheel designs. All available options are fetched from a REST API and the total price updates dynamically.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API](#api)
- [Customization Options](#customization-options)
- [Running Tests](#running-tests)

---

## Features

- **Real-time 3D rendering** — Full GLTF/GLB model of the Maserati Quattroporte rendered via Three.js with PBR materials
- **Body paint selection** — Choose from multiple factory paint colors with realistic metallic/clearcoat material properties
- **Brake caliper colors** — 8 caliper color options (silver, red, yellow, blue, matte blue, black, titanium, matte red)
- **Interior materials** — 6 leather/interior color presets applied to the cabin mesh
- **Wheel/rim swap** — 6 rim designs (Mercurio, Plutone, Urano + 3 specials) dynamically loaded and swapped on all four wheels
- **Immersive environment** — Procedurally created showroom with concrete floor and brick walls loaded from GLB assets
- **Orbit controls** — Mouse/touch orbit, zoom, and auto-rotate with constrained polar angles
- **Live pricing** — Base price and optional pricing fetched from the backend API

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 16 |
| 3D Engine | Three.js 0.135 + angular-three / angular-three/soba |
| Styling | TailwindCSS 2, SCSS, ng-bootstrap 16 |
| HTTP | Angular HttpClient |
| Reactive | RxJS 7 |
| Build | Angular CLI 16, cross-env |
| Tests | Karma + Jasmine |

---

## Architecture

```
AppComponent
└── CardComponent          ← main UI shell; owns selection state & fetches API data
    ├── CarConfiguratorComponent   ← Three.js canvas; receives @Input() bindings
    │     ├── GLTF model loader (NgtGLTFLoaderService)
    │     ├── Orbit controls (NgtSobaOrbitControls)
    │     ├── Dynamic material application (paint, caliper, interior)
    │     └── Rim swap system (loads .glb per rim type, replaces wheel meshes)
    └── WheelPreviewComponent     ← thumbnail grid for rim selection
```

**Data flow:**
1. `DbConnectionsService` fetches optionals and models from the REST API on init.
2. `CardComponent` filters results by model (`Quattroporte`) and category ID, maps image filenames to hex color values, and exposes reactive `Observable` streams.
3. User selections are stored as plain properties on `CardComponent` and passed down as `@Input()` bindings to `CarConfiguratorComponent`.
4. `CarConfiguratorComponent` applies changes directly to Three.js `MeshPhysicalMaterial` instances on the loaded GLTF scene without re-rendering the whole component.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Angular CLI](https://angular.io/cli) v16

```bash
npm install -g @angular/cli@16
```

---

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd Frontend_Configuratore_maserati

# Install dependencies
npm install

# Start the development server
npm start
```

Navigate to `http://localhost:4200/`. The app hot-reloads on source file changes.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start development server (`NODE_ENV=development`) |
| `npm run build` | Production build — output goes to `dist/angular-product-config/` |
| `npm run watch` | Incremental development build with watch mode |
| `npm test` | Run unit tests via Karma |

---

## Project Structure

```
src/
├── app/
│   ├── app.component.*          # Root component
│   ├── app.module.ts            # NgModule declarations and imports
│   ├── card/                    # Main configurator UI shell
│   ├── car-configurator/        # Three.js 3D viewport component
│   ├── wheel-preview/           # Rim selection thumbnail component
│   ├── service/
│   │   └── db-connections.service.ts   # HTTP calls to the backend API
│   └── interfaces/
│       ├── modelli.ts           # Modelli interface (car model entity)
│       ├── optionals.ts         # OptionalEntity interface
│       └── categorie-optional.ts
├── assets/
│   ├── maserati_quattroporte.glb   # Main car 3D model
│   ├── floor.glb / wall.glb        # Showroom environment models
│   ├── 1.glb – 6.glb               # Rim design models
│   ├── textures/                   # PBR texture maps
│   ├── interni/                    # Interior preview images
│   └── ...
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

---

## API

The frontend communicates with a REST backend hosted on Azure:

**Base URL:** `https://maseraticonfigurator.azurewebsites.net`

| Endpoint | Method | Description |
|---|---|---|
| `/api/cars/getOptional` | GET | Returns all `OptionalEntity` records (paints, calipers, rims, etc.) |
| `/api/cars/getModelli` | GET | Returns all `Modelli` records (car models with base prices) |

Options are filtered on the client side by `ModelloIDmongo.Nome === 'Quattroporte'` and by `CategoriaOptionalIDmongo.CategoriaOptionalID` (category `1` = paint, `3` = brake calipers).

---

## Customization Options

### Body Paint
Colors are fetched from the API (category ID `1`) and mapped from image filenames to hex values:

| Filename | Color |
|---|---|
| `carrozzeria_blu_passione.png` | `#1c1e3a` |
| `carrozzeria_nero_ribelle.png` | `#0f0f0f` |
| `carrozzeria_rosso_folgore.png` | `#86252b` |
| *(custom)* | `#02433f` |

### Brake Calipers
Colors are fetched from the API (category ID `3`) and mapped from image filenames to hex values (silver, blue, red, yellow, black, titanium, and anodized variants).

### Interior
Six hardcoded presets (`1.jpg` – `6.jpg`) mapped to leather/fabric color hex values applied to the interior mesh.

### Wheels / Rims
Six rim models selectable via thumbnail preview:

| Thumbnail | GLB Asset |
|---|---|
| `cerchi_mercurio.png` | `assets/3.glb` |
| `cerchi_plutone.png` | `assets/1.glb` |
| `cerchi_urano.png` | `assets/2.glb` |
| `rimSpecial.png` | `assets/5.glb` |
| `rimSpecial2.png` | `assets/6.glb` |
| `rimSpecial3.png` | `assets/4.glb` |

---

## Running Tests

```bash
npm test
```

Unit tests run via [Karma](https://karma-runner.github.io) with the Chrome launcher. Test files follow the `*.spec.ts` convention co-located with their source files.
