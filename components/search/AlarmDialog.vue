<template>
    <v-container>
        <v-layout row wrap>
            <template v-if="!created">
                <v-flex d-flex pb-4 lg8 xs12>
                    <v-alert v-model="error" dismissible type="error">
                        {{ errorMessage }}
                    </v-alert>
                </v-flex>
                <v-flex d-flex pb-4 offset-sm0 lg8 xs12>
                    <h1 class="headline font-weight-thin text-xs-center">
                        Precisa bastante ir nesse horário? Que tal se a gente te
                        avisar caso alguma carona apareça?
                    </h1>
                </v-flex>
                <v-flex
                d-flex
                offset-lg1
                xs8
                offset-xs2
                offset-sm3
                sm6
                >
                    <v-btn
                    :loading="creating"
                    :disabled="creating"
                    color="secondary"
                    class="white--text"
                    round
                    large
                    @click="createAlarm()"
                    >
                        <v-icon left dark>
                            add
                        </v-icon>Criar alarme
                    </v-btn>
                </v-flex>
            </template>
            <template v-else>
                <v-flex d-flex pb-4 lg8 xs12>
                    <h1 class="headline font-weight-thin text-xs-center">
                        <b>Alarme criado!</b><br>
                        Te mandaremos um email quando uma carona for criada
                        nesse horário.
                    </h1>
                </v-flex>
                <v-flex
                d-flex
                offset-lg1
                xs8
                offset-xs2
                offset-sm3
                sm6
                >
                    <v-btn
                    color="secondary"
                    class="white--text"
                    round
                    to="/alarms"
                    nuxt
                    large
                    >
                        Ver seus alarmes
                    </v-btn>
                </v-flex>
            </template>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            creating: false,
            created: false,
            error: false,
            errorMessage: null
        }
    },
    methods: {
        async createAlarm() {
            let data = this.$store.state.searchData.data
            let API_URL =
                process.env.SERVER_URL + '/api/' + process.env.API_VERSION
            let endpoint = '/alarms/'
            let payload = {
                method: 'post',
                url: API_URL + endpoint,
                data: data
            }
            this.creating = true
            try {
                await this.$auth.request(payload)
                this.created = true
                this.$store.commit('significantEvent/trigger')
                this.$ga.event('alarms', 'create')
            } catch (err) {
                this.error = true
                this.errorMessage = 'Opa! Algo de errado aconteceu!'
            }
            this.creating = false
        }
    }
}
</script>
