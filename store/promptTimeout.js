export const state = () => ({
    timeout: false
})

export const mutations = {
    set(state) {
        state.timeout = true
    }
}

