export const state = () => ({
    showDrawer: false,
    searchData: {}
})
export const mutations = {
    toggleDrawer(state) {
        state.showDrawer = !state.showDrawer
    },
    activateDrawer(state) {
        state.showDrawer = true
    },
    setDrawer(state, value) {
        state.showDrawer = value
    },
    setSearchData(state, data) {
        state.searchData = data
    }
}
