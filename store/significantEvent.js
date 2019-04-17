export const state = () => ({
    trigger: false
})

export const mutations = {
    trigger(state) {
        state.trigger = true
    },
    catch(state) {
        state.trigger = false
    }
}

