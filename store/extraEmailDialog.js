export default {
    state: {
        dialog: true
    },
    mutations: {
        denyExtraEmailDialog(state) {
            state.dialog = false
        }
    }
}
