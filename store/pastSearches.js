export const state = () => ({
    queries: []
})
export const mutations = {
    append(state, oriDest) {
        state.queries = state.queries.reverse()
        let index = state.queries.findIndex(
            i => i[0] == oriDest[0] && i[1] == oriDest[1]
        )
        if (index >= 0) {
            state.queries.splice(index, 1)
        }
        if (state.queries.length >= 3) {
            state.queries.shift()
        }
        state.queries.push(oriDest)
        state.queries = state.queries.reverse()
    }
}
