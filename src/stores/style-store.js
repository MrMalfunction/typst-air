import { acceptHMRUpdate, defineStore } from 'pinia'

export const useStyleStore = defineStore('styleStore', {
  state: () => ({
    fontSizePt: 10,
    colorCheck: true,
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStyleStore, import.meta.hot))
}
