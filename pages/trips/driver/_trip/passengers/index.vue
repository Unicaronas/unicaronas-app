<template>
    <v-container>
        <v-layout row wrap>
            <v-flex d-flex xs12 mt-5 offset-lg2>
                <h1 class="display-3 font-weight-thin mb-3">
                    Passageiros
                    <v-btn
                    :to="`/trips/driver/${$route.params.trip}/`"
                    outline
                    color="primary"
                    nuxt
                    >
                        Ver carona
                    </v-btn>
                </h1>
            </v-flex>
            <v-flex d-flex xs12 md4 />
            <v-flex d-flex xs12 lg8 mt-5 offset-lg2>
                <v-alert v-model="error" dismissible type="error">
                    {{ errorMessage }}
                </v-alert>
            </v-flex>
            <v-flex d-flex xs12 md4 />
            <template v-if="!hasScope">
                <v-flex d-flex xs12 md8 mt-5 offset-md2>
                    <v-alert value="true" type="error">
                        <b>Algumas permissões estão faltando</b>. Por favor,
                        refaça o login e aceite pelo menos as permissões de
                        leitura e modificação de suas caronas.
                    </v-alert>
                </v-flex>
                <v-flex
                d-flex
                xs12
                mb-5
                md2
                mt-3
                offset-md5
                >
                    <v-btn round color="primary" ripple @click="$auth.login()">
                        Refazer login
                    </v-btn>
                </v-flex>
            </template>
            <template v-else>
                <v-flex
                d-flex
                xs12
                mb-5
                lg6
                offset-lg3
                mt-3
                >
                    <v-layout
                    v-if="passengers !== null && passengers.length"
                    row
                    align-start
                    justify-start
                    wrap
                    >
                        <v-flex d-flex xs12>
                            <List
                            :items="passengers"
                            @modified="loadPassengers"
                            />
                        </v-flex>
                    </v-layout>
                    <v-layout
                    v-else-if="passengers !== null && !passengers.length"
                    row
                    align-start
                    justify-start
                    wrap
                    >
                        <v-flex d-flex xs12>
                            <h1
                            class="display-1 font-weight-thin mb-3 text-xs-center"
                            >
                                Sem passageiros
                            </h1>
                        </v-flex>
                    </v-layout>
                    <v-container
                    v-else-if="passengers === null && !error"
                    fluid
                    fill-height
                    >
                        <v-layout align-center justify-center>
                            <v-layout row wrap>
                                <v-flex d-flex xs12>
                                    <h1
                                    class="display-1 font-weight-thin mb-3 text-xs-center"
                                    >
                                        Carregando passageiros...
                                    </h1>
                                </v-flex>
                                <v-flex d-flex xs12>
                                    <v-progress-circular
                                    :size="70"
                                    :width="7"
                                    color="blue"
                                    indeterminate
                                    />
                                </v-flex>
                            </v-layout>
                        </v-layout>
                    </v-container>
                </v-flex>
            </template>
        </v-layout>
    </v-container>
</template>
<script>
import List from '~/components/driver/passengers/List.vue'

export default {
    components: { List },
    data() {
        return {
            passengers: [],
            hasScope: false,

            error: false,
            errorMessage: ''
        }
    },
    head() {
        return {
            title: 'Passageiros - ' + process.env.APP_NAME
        }
    },
    asyncData({ app, params, error }) {
        let API_URL = process.env.SERVER_URL + '/api/' + process.env.API_VERSION
        let endpoint = API_URL + '/trips/driver/' + params.trip + '/passengers/'
        return app.$auth
            .request(endpoint)
            .then(res => {
                return { passengers: res.results }
            })
            .catch(e => {
                error({ statusCode: 404, message: 'Carona não encontrada' })
            })
    },
    mounted() {
        this.hasScope =
            this.$auth.hasScope('trips:driver:read') &&
            this.$auth.hasScope('trips:driver:write')
    },
    validate({ params }) {
        return /^\d+$/.test(params.trip)
    },
    methods: {
        async loadPassengers() {
            let API_URL =
                process.env.SERVER_URL + '/api/' + process.env.API_VERSION
            let endpoint =
                API_URL +
                '/trips/driver/' +
                this.$route.params.trip +
                '/passengers/'
            try {
                this.passengers = await this.$auth.request(endpoint)
                this.passengers = this.passengers.results
            } catch (err) {
                this.error = true
                this.errorMessage =
                    'Não foi possível carregar a lista de passageiros'
            }
        }
    }
}
</script>
