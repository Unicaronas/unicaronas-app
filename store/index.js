import Vuex from 'vuex'
import Theme from './theme.js'
import pastSearches from './pastSearches.js'
import installPromptTimeout from './installPromptTimeout.js'

const createStore = () => {
    return new Vuex.Store({
        modules: {
            theme: Theme,
            pastSearches: pastSearches,
            installPromptTimeout: installPromptTimeout
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
