import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

export default ({ store }) => {
    window.onNuxtReady(() => {
        createPersistedState({
            key: 'vuex-cookies-7',
            paths: ['installPromptTimeout'],
            storage: {
                getItem: key => Cookies.get(key),
                setItem: (key, value) =>
                    Cookies.set(key, value, { expires: 7, secure: false }),
                removeItem: key => Cookies.remove(key)
            }
        })(store)
    })
}
