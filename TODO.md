# Reaper Web Controllers

Create a Svelte project to build a small set of web UIs for controlling the Reaper DAW remotely.

## General Requirements

- UIs should be independent, descriptively-named HTML pages at the root of the build output dir
- They should use a shared set of js/css files
- UIs must run offline (all functionality encapsulated in the enclosed html/js/css files)
- Use Tailwind for styling; leverage Tailwind classes/components as much as possible over custom CSS
- Bundle a web font for consistent look across devices (offline-capable)
- Bundle Reaper's `main.js` communication library as a vendored dependency (copy from `~/opt/REAPER/Plugins/reaper_www_root/main.js`)
- Responsive layout targeting both phone and tablet (portrait and landscape)
- For reference, existing built-in UIs are at: `~/opt/REAPER/Plugins/reaper_www_root/`
- Post-build step: wipe and replace `~/.config/REAPER/reaper_www_root/` with the build output (full replace, not merge)

## Communication with Reaper

Uses Reaper's built-in HTTP polling web interface via `main.js`:
- `wwr_start()` begins polling
- `wwr_req("command")` sends one-time requests
- `wwr_req_recur("command", interval_ms)` sets recurring requests (e.g. status polling)
- Responses arrive via a `wwr_onreply(results)` callback; results are `\n`-separated lines with `\t`-separated tokens

## Page 1: "More Me" (Personal Monitor Mixer)

An improved version of the built-in `more_me.html`. Allows a performer to control their personal monitor mix by adjusting receive levels on their dedicated monitor track.

### Core Concept (same as original)
- Auto-detect "monitor tracks" (tracks that have both receives AND hardware outputs)
- User selects their monitor track from a dropdown
- Display faders for each receive (source track) feeding into the selected monitor track

### Improvements over the built-in version
- **Better faders**: Larger touch-friendly faders with dB readout
- **Per-receive pan control**: Add pan knob/slider for each receive channel
- **Master output fader**: Prominent fader for the monitor track's hardware output level
- **Metering**: Peak/VU meters for each receive channel
- **Track color theming**: Use Reaper track colors for visual organization of receive channels
- **Mute per receive**: Toggle mute on individual receive sends (existing feature, keep it)

## Page 2: "Controller" (Full DAW Remote)

A modern version of the built-in `fancier.html` with the full feature set:

### Transport
- Play, stop, pause, record buttons with visual state feedback
- Record arm count display / abort button when recording
- Time/position display (supports multiple formats: timecode, seconds, measures.beats)

### Track Mixer
- Track list showing all tracks with:
  - Track name and color
  - Volume fader per track
  - Mute, Solo, Record Arm, Record Monitor buttons per track
  - Peak metering per track
- Send/receive management per track

### Navigation
- Marker and region display with prev/current/next navigation
- Region visualization with color coding
- Drop marker at current position
- Jump to home/end

### Utilities
- Metronome toggle
- Snap toggle
- Jog/scrub control
- Time signature display
- Beat position arc/indicator
- Repeat/loop toggle
