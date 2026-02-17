function createTransportStore() {
  let playState = $state(0)
  let positionSeconds = $state(0)
  let positionString = $state('')
  let positionBeats = $state('')
  let repeatOn = $state(false)
  let metronomeOn = $state(false)
  let snapOn = $state(false)

  let fullBeatPos = $state(0)
  let measureCount = $state(0)
  let beatsInMeasure = $state(0)
  let tsNumerator = $state(4)
  let tsDenominator = $state(4)

  return {
    get playState() { return playState },
    get isPlaying() { return !!(playState & 1) },
    get isPaused() { return !!(playState & 2) },
    get isRecording() { return !!(playState & 4) },
    get positionSeconds() { return positionSeconds },
    get positionString() { return positionString },
    get positionBeats() { return positionBeats },
    get repeatOn() { return repeatOn },
    get metronomeOn() { return metronomeOn },
    get snapOn() { return snapOn },
    get fullBeatPos() { return fullBeatPos },
    get measureCount() { return measureCount },
    get beatsInMeasure() { return beatsInMeasure },
    get tsNumerator() { return tsNumerator },
    get tsDenominator() { return tsDenominator },

    handleTransport(tok) {
      if (tok.length > 5) {
        playState = parseInt(tok[1])
        positionSeconds = parseFloat(tok[2])
        repeatOn = parseInt(tok[3]) !== 0
        positionString = tok[4]
        positionBeats = tok[5]
      }
    },

    handleBeatPos(tok) {
      if (tok.length > 7) {
        fullBeatPos = parseFloat(tok[3])
        measureCount = parseInt(tok[4])
        beatsInMeasure = parseFloat(tok[5])
        tsNumerator = parseInt(tok[6])
        tsDenominator = parseInt(tok[7])
      }
    },

    handleCmdState(tok) {
      if (tok[1] === '40364') metronomeOn = parseInt(tok[2]) > 0
      if (tok[1] === '1157') snapOn = parseInt(tok[2]) > 0
    },
  }
}

export const transportStore = createTransportStore()
