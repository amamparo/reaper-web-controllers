import { transportStore } from '$lib/stores/transport.svelte.js'
import { tracksStore } from '$lib/stores/tracks.svelte.js'
import { markersStore } from '$lib/stores/markers.svelte.js'

// Thin wrappers around window globals set by vendor/main.js
export const wwr_req = (cmd) => window.wwr_req?.(cmd)
export const wwr_req_recur = (cmd, interval) => window.wwr_req_recur?.(cmd, interval)
export const wwr_req_recur_cancel = (cmd) => window.wwr_req_recur_cancel?.(cmd)

let afterReplyCallbacks = []

export function onAfterReply(fn) {
  afterReplyCallbacks.push(fn)
  return () => { afterReplyCallbacks = afterReplyCallbacks.filter(f => f !== fn) }
}

export function initReaper(mode) {
  window.wwr_onreply = function(results) {
    const lines = results.split('\n')
    for (const line of lines) {
      const tok = line.split('\t')
      if (tok.length === 0) continue

      switch (tok[0]) {
        case 'TRANSPORT':
          transportStore.handleTransport(tok)
          break
        case 'BEATPOS':
          transportStore.handleBeatPos(tok)
          break
        case 'CMDSTATE':
          transportStore.handleCmdState(tok)
          break
        case 'NTRACK':
          tracksStore.handleNtrack(tok)
          break
        case 'TRACK':
          tracksStore.handleTrack(tok)
          break
        case 'SEND':
          tracksStore.handleSend(tok)
          break
        case 'MARKER_LIST':
          markersStore.beginMarkers()
          break
        case 'MARKER':
          markersStore.addMarker(tok)
          break
        case 'MARKER_LIST_END':
          markersStore.endMarkers()
          break
        case 'REGION_LIST':
          markersStore.beginRegions()
          break
        case 'REGION':
          markersStore.addRegion(tok)
          break
        case 'REGION_LIST_END':
          markersStore.endRegions()
          break
      }
    }

    for (const cb of afterReplyCallbacks) cb()
  }

  if (mode === 'more-me') {
    wwr_req_recur('NTRACK;TRACK', 100)
  } else if (mode === 'controller') {
    wwr_req_recur('TRANSPORT;BEATPOS', 100)
    wwr_req_recur('NTRACK;TRACK;GET/40364;GET/1157', 100)
    wwr_req_recur('MARKER;REGION', 500)
  }

  window.wwr_start?.()
}
