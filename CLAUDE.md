# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Build to dist/
npm run deploy    # Build + wipe & replace ~/.config/REAPER/reaper_www_root/
```

No test framework is configured. Verify changes by building (`npm run build`) and checking for Svelte/Vite warnings in the output.

## Architecture

This is a **Vite multi-page app (MPA)** with two independent Svelte 5 pages that control Reaper DAW via its built-in HTTP polling interface:

- **more-me.html** — Personal monitor mixer (performer selects their monitor track, adjusts receive levels/pan/mute)
- **controller.html** — Full DAW remote (transport, track mixer, marker/region nav, jog wheel, utilities)

Each HTML entry is at the project root (for flat `dist/` output) and mounts its own Svelte app from `src/{page}/main.js` → `src/lib/components/{page}/App.svelte`.

### Reaper Communication

`public/vendor/main.js` is Reaper's communication library, loaded as a classic `<script>` tag (not an ES module — its `var` declarations must be window globals). **Do not modify this file.**

`src/lib/reaper/api.svelte.js` wraps the window globals and provides:
- `initReaper(mode)` — sets up `window.wwr_onreply` dispatcher and starts polling
- `wwr_req(cmd)` / `wwr_req_recur(cmd, ms)` — send commands to Reaper
- `onAfterReply(fn)` — hook to run code after each polling response (used by More Me for receive polling)

The `wwr_onreply` dispatcher parses tab-separated response lines and routes them to the appropriate store by command prefix (TRANSPORT, TRACK, SEND, MARKER, etc.).

### State Management

Stores use **Svelte 5 runes** (`$state`, `$derived`) in `.svelte.js` files. Each store is a factory-function singleton:

```js
function createFooStore() {
  let value = $state(0)
  return {
    get value() { return value },
    handleResponse(tok) { value = parseInt(tok[1]) },
  }
}
export const fooStore = createFooStore()
```

Components import stores directly (no context API).

### Key Domain Concepts

- **Monitor track**: A track with both `recvCount > 0` AND `hwOutCount > 0` (auto-detected for More Me)
- **Receive indices are negative**: `-1` = first receive, `-2` = second. Send index `0` = hardware output.
- **Volume fader law**: Quartic — `vol = pos^4 * 4` (position 0–1 → volume 0–4 linear). See `volToFaderPos`/`faderPosToVol` in helpers.js.
- **Edit completion suffix**: Commands ending with `e` tell Reaper to capture for undo (send on fader release via `oncomplete`, not during drag via `onchange`).
- **Track flags are bitmasks**: `TrackFlags.MUTED = 8`, test with `!!(flags & TrackFlags.MUTED)`.
- **Reaper colors**: 0xAARRGGBB integers. `0` = no custom color. Parse with `reaperColorToCSS()`.
- **Peak values**: dB × 10 integers (-600 = -60dB, 0 = 0dB, positive = clipping).

### Shared Components

`src/lib/components/shared/` contains touch-optimized controls used by both pages:
- **Fader** — `<input type="range">` with quartic law, drag guard (ignores external updates while dragging), separate `onchange`/`oncomplete` callbacks
- **PanControl** — Center-detent slider (-1 to 1)
- **MeterBar** — Stereo peak meter with gradient and clip indicator
- **ToggleButton** — Stateful button with configurable active/inactive colors

## Conventions

- Svelte 5 runes only (`$state`, `$derived`, `$props()`, `$effect`). No `export let` or legacy stores.
- Tailwind-first styling. Minimal custom CSS (only in `global.css`).
- All interactive elements: 44px minimum touch target.
- `$lib` alias resolves to `src/lib/`.
