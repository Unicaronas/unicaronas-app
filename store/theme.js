export const state = () => ({
    toolbarColor: 'dark',
    navColor: 'light',
    cardColor: 'dark',
    appColor: 'light'
})
export const mutations = {
    setNavTheme(state, theme) {
        state.navColor = theme
    },
    setToolbarTheme(state, theme) {
        state.toolbarColor = theme
    },
    setCardsTheme(state, theme) {
        state.cardColor = theme
    },
    setAppTheme(state, theme) {
        state.appColor = theme
    }
}
