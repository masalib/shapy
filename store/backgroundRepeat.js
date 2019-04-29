import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
  active: 'no-repeat',
  values: ['no-repeat', 'repeat', 'space', 'round', 'repeat-x', 'repeat-y']
})

export const getters = {
  getField
}

export const mutations = {
  updateField
}
