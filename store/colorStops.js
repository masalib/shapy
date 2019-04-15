// TODO: Add action for updating max PX value for color stop, based on box size
// TODO: Refactor

import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  activeStop: {},
  stops: [
    {
      id: 'ap6y8f70k', // ID of gradient
      pct: 0, // Gradient stop
      defaultUnit: true, // %/px
      color: {
        // Color from color picker
        a: 1,
        hex: '#812525',
        hex8: '#812525FF',
        hsl: { a: 1, h: 0, l: 0.3248028, s: 0.5517107611141283 },
        hsv: { a: 1, h: 0, s: 0.7111, v: 0.504 },
        oldHue: 0,
        rgba: { a: 1, b: 37, g: 37, r: 129 },
        source: 'hsva'
      }
    },
    {
      id: 'h1qlz9p91',
      pct: 100,
      defaultUnit: true,
      color: {
        // Color from color picker
        a: 1,
        hex: '#812525',
        hex8: '#812525FF',
        hsl: { a: 1, h: 0, l: 0.3248028, s: 0.5517107611141283 },
        hsv: { a: 1, h: 0, s: 0.7111, v: 0.504 },
        oldHue: 0,
        rgba: { a: 1, b: 37, g: 37, r: 129 },
        source: 'hsva'
      }
    }
  ]
})

export const getters = {
  getField,
  // Color stops sorted according to position
  sortedStops(state) {
    return state.stops.slice(0).sort((a, b) => a.pct - b.pct)
  },
  // All color stops for the gradient
  colorString(state) {
    const colors = state.stops
      .sort((a, b) => a.pct - b.pct)
      .map(stop => {
        return `${stop.color.hex} ${stop.pct}%`
      })
    return colors.join(', ')
  },
  activeGradient(state) {
    // Current gradient shown in the color bar
    const sortedStops = state.stops.slice(0).sort((a, b) => a.pct - b.pct)
    const stops = sortedStops.map(stop => {
      return stop.defaultUnit
        ? `${stop.color.hex} ${stop.pct}%`
        : `${stop.color.hex} ${stop.px}px`
    })
    return `linear-gradient(to right, ${stops.join(', ')})`
  }
}

export const mutations = {
  updateField,
  UPDATE_COLOR(state, color) {
    state.activeStop.color = color
  },
  REMOVE_STOP(state, id) {
    // Remove stop by ID
    state.stops = state.stops.filter(stop => stop.id !== id)
  },
  MOVE_UP(state, id) {
    // I honestly don't understand how this is working, but it is...
    // Index of stop being moved
    const clickedIndex = state.stops.findIndex(stop => stop.id === id)
    // Stop object being moved
    const clickedStop = state.stops.find(stop => stop.id === id)
    // Index of stop above the stop being moved
    const aboveIndex = clickedIndex === 0 ? 0 : clickedIndex - 1
    // Stop object above stop being moved
    const aboveStop = state.stops[aboveIndex]

    const abovePct = JSON.parse(JSON.stringify(aboveStop.pct))
    const clickedPct = JSON.parse(JSON.stringify(clickedStop.pct))

    // Make sure all values but pct changes
    state.stops[aboveIndex].pct = clickedPct
    state.stops[clickedIndex].pct = abovePct
  },
  MOVE_DOWN(state, id) {
    // I honestly don't understand how this is working, but it is...
    // Index of stop being moved
    const clickedIndex = state.stops.findIndex(stop => stop.id === id)
    // Stop object being moved
    const clickedStop = state.stops.find(stop => stop.id === id)
    // Index of stop above the stop being moved
    const belowIndex = clickedIndex + 1
    // Stop object above stop being moved
    const belowStop = state.stops[belowIndex]

    const belowPct = JSON.parse(JSON.stringify(belowStop.pct))
    const clickedPct = JSON.parse(JSON.stringify(clickedStop.pct))

    // Make sure all values but pct changes
    state.stops[belowIndex].pct = clickedPct
    state.stops[clickedIndex].pct = belowPct
  },
  CREATE_STOP(state, stop) {
    state.stops.push(stop)
  },
  UPDATE_STOP(state, { point, id }) {
    state.stops.find(stop => stop.id === id).pct = point
  },
  SET_ACTIVE(state, stop) {
    state.activeStop = stop
  }
}

export const actions = {
  removeStop({ commit, state }, id) {
    if (state.stops.length > 2) {
      commit('REMOVE_STOP', id)
    }
  },
  moveUp({ commit, state }, id) {
    commit('MOVE_UP', id)
  },
  moveDown({ commit }, id) {
    commit('MOVE_DOWN', id)
  },
  createStop({ commit, dispatch }, { point, color }) {
    const stop = {
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      pct: point,
      defaultUnit: true,
      color: color
    }
    commit('CREATE_STOP', stop)
    dispatch('setActive', stop)
  },
  updateStop({ commit }, { point, id }) {
    commit('UPDATE_STOP', { point, id })
  },
  setActive({ commit }, stop) {
    commit('SET_ACTIVE', stop)
  },
  updateColor({ commit }, color) {
    commit('UPDATE_COLOR')
  }
}
