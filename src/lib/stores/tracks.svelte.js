function createTracksStore() {
  let trackCount = $state(0)
  let tracks = $state([])
  let sends = $state({})

  return {
    get trackCount() { return trackCount },
    get tracks() { return tracks },
    get sends() { return sends },

    handleNtrack(tok) {
      if (tok.length > 1) {
        trackCount = parseInt(tok[1]) + 1 // +1 includes master
      }
    },

    handleTrack(tok) {
      if (tok.length < 13) return
      const idx = parseInt(tok[1])
      const track = {
        index: idx,
        name: tok[2].trim(),
        flags: parseInt(tok[3]),
        volume: parseFloat(tok[4]),
        pan: parseFloat(tok[5]),
        peakL: parseInt(tok[6]),
        peakR: parseInt(tok[7]),
        width: parseFloat(tok[8]),
        panMode: parseInt(tok[9]),
        sendCount: parseInt(tok[10]),
        recvCount: parseInt(tok[11]),
        hwOutCount: parseInt(tok[12]),
        color: tok[13] ? parseInt(tok[13]) : 0,
      }
      while (tracks.length <= idx) tracks.push(null)
      tracks[idx] = track
    },

    handleSend(tok) {
      if (tok.length < 7) return
      const trackIdx = parseInt(tok[1])
      const sendIdx = parseInt(tok[2])
      const key = `${trackIdx}:${sendIdx}`
      sends[key] = {
        trackIndex: trackIdx,
        sendIndex: sendIdx,
        flags: parseInt(tok[3]),
        volume: parseFloat(tok[4]),
        pan: parseFloat(tok[5]),
        otherTrackIndex: parseInt(tok[6]),
        isMuted: !!(parseInt(tok[3]) & 8),
        isHardwareOutput: parseInt(tok[6]) === -1,
      }
    },

    getMonitorTracks() {
      return tracks.filter(t => t && t.recvCount > 0 && t.hwOutCount > 0)
    },

    getTrack(index) {
      return tracks[index] || null
    },

    getSend(trackIdx, sendIdx) {
      return sends[`${trackIdx}:${sendIdx}`] || null
    },
  }
}

export const tracksStore = createTracksStore()
