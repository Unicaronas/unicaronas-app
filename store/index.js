import Vuex from 'vuex'
import Theme from './theme.js'

const createStore = () => {
    return new Vuex.Store({
        modules: {
            theme: Theme
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
