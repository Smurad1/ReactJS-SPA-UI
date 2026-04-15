**Vite** is a modern frontend build tool and development server for JavaScript projects. Here's what you need to know:

## Key Features

**⚡ Lightning-fast development** — Uses native ES modules during development, so the server starts instantly and updates happen in milliseconds (Hot Module Replacement).

**📦 Optimized builds** — Automatically bundles your code with tree-shaking, code splitting, and minification for production.

**🔧 Framework-agnostic** — Works with React, Vue, Svelte, and vanilla JavaScript.

**⚙️ Zero-config** — Works out of the box with sensible defaults, though you can customize with vite.config.js.

## Vite vs Traditional Bundlers

| Aspect | Vite | Webpack |
|--------|------|---------|
| **Dev Start Time** | Near instant | Takes several seconds |
| **Hot Reload** | < 100ms | Slower |
| **Build Tool** | Modern (ESbuild) | Mature but slower |

## How It Works

1. **In Development** — Vite serves your source files directly via ES modules, so the browser only loads what it needs
2. **In Production** — Vite bundles everything using Rollup for optimal performance

## In Your Project

Your frontend uses Vite with:
- `npm run dev` — Starts the dev server on `http://localhost:5173` with hot reloading
- `npm run build` — Creates an optimized production build in the `dist/` folder
- `npm run preview` — Previews the production build locally

Vite is ideal for modern web development because it dramatically speeds up the development experience compared to older bundlers like Webpack.