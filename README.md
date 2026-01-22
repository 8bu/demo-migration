# Micro-Frontend Migration Demo

> **Strangler Fig Pattern** — Incrementally migrate Vue 2 to Vue 3 without a big-bang rewrite

A modern **Nuxt 4 Shell** hosts legacy **Nuxt 2 pages** via **Module Federation** and **Web Components**. Legacy pages run inside the shell as custom elements with Shadow DOM isolation — no iframes.



https://github.com/user-attachments/assets/9aafe3ff-40b4-4db2-ae13-82f8e05e71c9



## How It Works

- **Shell** (Nuxt 4 / Vue 3) — Host application
  - Native pages: `/`, `/about`, `/demo`
  - `LegacyLoader` — catches legacy routes, loads remote modules
- **Legacy** (Nuxt 2 / Vue 2) — Remote application
  - Exposes pages via **Module Federation** (`remoteEntry.js`)
  - Pages wrapped as **Web Components** (`<legacy-dashboard>`, etc.)
  - **Shadow DOM** isolates styles (no CSS conflicts)

## Tech Stack

| | Shell (Host) | Legacy (Remote) |
|---|---|---|
| Framework | Nuxt 4 | Nuxt 2 |
| Vue | 3.5 | 2.7 |
| Bundler | Vite | Webpack 5 |
| Styling | Tailwind `shell-*` | Tailwind `legacy-*` |

## Adding New Federation Modules

### 1. Add to config

```js
// packages/shared/federation.config.js
pages: {
  'my-page': {
    source: 'pages/my-page',
    route: { path: 'my-page', title: 'My Page' }
  }
}
```

### 2. (Optional) Add co-located config

```js
// apps/legacy/pages/my-page.federation.js
module.exports = {
  events: ['state:changed'],
  injectSharedState: true  // receives sharedUser, sharedTheme props
}
```

### 3. Mirror in shell config

```ts
// apps/shell/config/federation.ts
// Add same entry to federationConfig.pages
```

Wrappers are auto-generated at build time. No manual Web Component code needed.

## Usage

### Development

```bash
npm run install:all

# Run both apps (shell: 3000, legacy: 3001)
npm run dev
```

### Production Build

```bash
npm run build        # Outputs to /deploy
npx serve deploy     # Test locally
```

### Routes

| URL | Type |
|-----|------|
| `/` | Shell (Vue 3) |
| `/about` | Shell (Vue 3) |
| `/demo` | Shell (Vue 3) — shows legacy components |
| `/dashboard` | Legacy (Vue 2) |
| `/booking` | Legacy (Vue 2) |
| `/settings` | Legacy (Vue 2) |

## License

MIT
