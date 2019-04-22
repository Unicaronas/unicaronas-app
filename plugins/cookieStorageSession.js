import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

export default ({ store }) => {
    window.onNuxtReady(() => {
        createPersistedState({
            key: 'vuex-cookies-session',
            paths: ['profilePicDialog', 'extraEmailDialog'],
            storage: {
                getItem: key => Cookies.get(key),
                setItem: (key, value) =>
                    Cookies.set(key, value, { secure: false }),
                removeItem: key => Cookies.remove(key)
            }
        })(store)
    })
}
