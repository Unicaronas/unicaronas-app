import Vuex from 'vuex'
import Theme from './theme.js'
import pastSearches from './pastSearches.js'

const createStore = () => {
    return new Vuex.Store({
        modules: {
            theme: Theme,
            pastSearches: pastSearches
        },
        state: {
            showDrawer: false,
            searchData: {}
        },
        mutations: {
            toggleDrawer(state) {
                state.showDrawer = !state.showDrawer
            },
            activateDrawer(state) {
                state.showDrawer = true
            },
            setSearchData(state, data) {
                state.searchData = data
            }
        }
    })
}

export default createStore
