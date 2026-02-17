import { tracksStore } from './tracks.svelte.js'

function createMonitorStore() {
  let selectedTrackIndex = $state(-1)

  return {
    get selectedTrackIndex() { return selectedTrackIndex },
    set selectedTrackIndex(v) { selectedTrackIndex = v },

    get selectedTrack() {
      if (selectedTrackIndex < 0) return null
      return tracksStore.getTrack(selectedTrackIndex)
    },

    get monitorTracks() {
      return tracksStore.getMonitorTracks()
    },

    pollReceives() {
      if (selectedTrackIndex < 0) return
      const track = tracksStore.getTrack(selectedTrackIndex)
      if (!track) return
      const wwr_req = window.wwr_req
      if (!wwr_req) return
      for (let y = 1; y <= track.recvCount; y++) {
        wwr_req(`GET/TRACK/${selectedTrackIndex}/SEND/${-y}`)
      }
      if (track.hwOutCount > 0) {
        wwr_req(`GET/TRACK/${selectedTrackIndex}/SEND/0`)
      }
    },
  }
}

export const monitorStore = createMonitorStore()
