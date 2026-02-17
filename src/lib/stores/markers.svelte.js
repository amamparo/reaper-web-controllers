function createMarkersStore() {
  let markers = $state([])
  let regions = $state([])
  let _markersTemp = []
  let _regionsTemp = []

  return {
    get markers() { return markers },
    get regions() { return regions },

    beginMarkers() { _markersTemp = [] },
    addMarker(tok) {
      _markersTemp.push({
        name: tok[1],
        id: parseInt(tok[2]),
        position: parseFloat(tok[3]),
        color: tok[4] ? parseInt(tok[4]) : 0,
      })
    },
    endMarkers() { markers = [..._markersTemp] },

    beginRegions() { _regionsTemp = [] },
    addRegion(tok) {
      _regionsTemp.push({
        name: tok[1],
        id: parseInt(tok[2]),
        start: parseFloat(tok[3]),
        end: parseFloat(tok[4]),
        color: tok[5] ? parseInt(tok[5]) : 0,
      })
    },
    endRegions() { regions = [..._regionsTemp] },

    getNavContext(posSeconds) {
      const pos = parseFloat(posSeconds)
      const sorted = [...markers].sort((a, b) => a.position - b.position)
      let prev = null, current = null, next = null
      for (const m of sorted) {
        const diff = m.position - pos
        if (diff < -0.01) prev = m
        else if (Math.abs(diff) <= 0.01) current = m
        else if (diff > 0.01 && !next) next = m
      }
      return { prev, current, next }
    },

    getActiveRegions(posSeconds) {
      const pos = parseFloat(posSeconds)
      return regions.filter(r => pos >= r.start && pos < r.end)
    },
  }
}

export const markersStore = createMarkersStore()
