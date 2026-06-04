# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run test      # Run all Vitest tests
```

Run a single test file:
```bash
npx vitest run src/stores/__tests__/matches.test.js
```

Docker dev environment (alternative to local Node):
```bash
docker compose up
```

Requires a `.env` file with `VITE_API_KEY` (see `.env.example`) — the API key for football-data.org.

## Architecture

Vue 3 + Vite SPA that tracks FIFA World Cup 2026 matches in real time, deployed on Netlify.

### Data flow

1. **API** (`src/api/footballData.js`) — thin wrapper around football-data.org v4. In dev it calls the API directly using `VITE_API_KEY`; in production all requests go to `/api/*` which Netlify rewrites to `netlify/functions/proxy.js` (avoids CORS and hides the key).
2. **Stores** (`src/stores/`) — three Pinia stores (`matches`, `standings`, `scorers`). Stores own fetch state (`isLoading`, `error`) and expose computed getters (`liveMatches`, `upcomingMatches`, `matchesByGroup`, etc.).
3. **Composables** — `usePolling` drives smart auto-refresh: 60 s when live, 5 min if a match is today, 30 min otherwise (interval is computed from the store). `useArgTime` converts all UTC times to `America/Argentina/Buenos_Aires` and formats them in Spanish.
4. **Views** consume stores directly; components receive data as props.

### Routing

Five routes defined in `src/router/index.js`:

| Path | View | Description |
|---|---|---|
| `/` | DashboardView | Live + upcoming matches |
| `/grupos` | GroupsView | Group stage standings |
| `/cruces` | KnockoutView | Bracket / elimination rounds |
| `/estadisticas` | StatsView | Scorers & goalkeeper stats |
| `/agenda` | AgendaView | All matches by date |

### Layout

`App.vue` renders a single `<AppLayout>`. Layout detects a 768 px breakpoint: desktop shows a sticky sidebar (`AppSidebar`), mobile shows `AppBottomNav` at the bottom. Content is always rendered via `<RouterView>`.

### Styling

Tailwind CSS with a custom dark theme defined in `tailwind.config.js`:
- Backgrounds: `bg`, `surface`, `surface-2`
- Accent colors: `red` (primary), `ochre` (scores/goals)
- Text: `text`, `text-muted`, `text-disabled`
- Border: `border`

Icons come from `lucide-vue-next`.

### API group format

The football-data.org API returns group identifiers as `"Group A"` (not `"GROUP_A"`). When displaying group labels, use the regex `/^(GROUP_|Group )/i` → `'Grupo '` to handle both formats.

### Tests

Tests use Vitest + jsdom. Patterns to follow:
- Mock `fetch` with `vi.fn()` for API tests.
- Always call `setActivePinia(createPinia())` before each store test.
- Use `vi.useFakeTimers()` / `vi.useRealTimers()` for polling and time tests.
