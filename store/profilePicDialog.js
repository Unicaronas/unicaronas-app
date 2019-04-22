export const state = () => ({
    dialog: true
})
export const mutations = {
    deny(state) {
        state.dialog = false
    }
}
