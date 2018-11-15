<template>
    <v-container>
        <v-layout row wrap>
            <v-flex
            d-flex
            xs12
            mt-5
            offset-lg2>
                <h1 class="display-3 font-weight-thin mb-3">Detalhes da carona</h1>
            </v-flex>
            <v-flex d-flex xs12 md4 />
            <v-flex d-flex xs12 lg8 mt-5 offset-lg2>
                <v-alert v-model="error" dismissible type="error" >
                    {{ errorMessage }}
                </v-alert>
            </v-flex>
            <v-flex d-flex xs12 md4 />
            <template v-if="!hasScope">
                <v-flex d-flex xs12 md8 mt-5 offset-md2>
                    <v-alert value="true" type="error" >
                        <b>Algumas permissões estão faltando</b>. Por favor, refaça o login e aceite pelo menos as permissões de informações sobre suas caronas e de entrada e saída delas.
                    </v-alert>
                </v-flex>
                <v-flex
                d-flex
                xs12
                mb-5
                md2
                mt-3
                offset-md5>
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
                lg9
                offset-lg2
                mt-3>
                    <v-container
                    grid-list-sm>
                        <v-layout
                        v-if="trip"
                        wrap
                        row>
                            <v-flex d-flex xs12 md7>
                                <v-layout row wrap align-start>
                                    <v-flex d-flex xs12>
                                        <TripInfo :trip="trip" />
                                    </v-flex>
                                    <v-flex d-flex xs12 fill-height>
                                        <Passengers :trip="trip" />
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex d-flex xs12 md5>
                                <v-layout row wrap>
                                    <v-flex d-flex xs12>
                                        <Status :trip="trip" />
                                    </v-flex>
                                    <v-flex d-flex xs12 fill-height>
                                        <DriverInfo :trip="trip" />
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                        <v-container v-else-if="!error" fluid fill-height>
                            <v-layout align-center justify-center>
                                <v-layout row wrap>
                                    <v-flex d-flex xs12>
                                        <h1 class="display-1 font-weight-thin mb-3 text-xs-center">Carregando carona...</h1>
                                    </v-flex>
                                    <v-flex d-flex xs12>
                                        <v-progress-circular :size="70" :width="7" color="blue" indeterminate />
                                    </v-flex>
                                </v-layout>
                            </v-layout>
                        </v-container>
                    </v-container>
                </v-flex>
            </template>
        </v-layout>
    </v-container>
</template>
<script>
import DriverInfo from '~/components/passenger/details/DriverInfo.vue'
import TripInfo from '~/components/passenger/details/TripInfo.vue'
import Status from '~/components/passenger/details/Status.vue'
import Passengers from '~/components/passenger/details/Passengers.vue'

export default {
    components: { DriverInfo, TripInfo, Status, Passengers },
    data() {
        return {
            trip: null,
            error: false,
            errorMessage: null,
            hasScope: false
        }
    },
    head() {
        return {
            title: 'Detalhes da carona - ' + process.env.APP_NAME
        }
    },
    mounted() {
        this.hasScope =
            this.$auth.hasScope('trips:passenger:read') &&
            this.$auth.hasScope('trips:passenger:write')
    },
    validate({ params }) {
        return /^\d+$/.test(params.trip)
    },
    asyncData({ app, params, error }) {
        let API_URL = process.env.SERVER_URL + '/api/' + process.env.API_VERSION
        let endpoint = API_URL + '/trips/passenger/' + params.trip + '/'
        return app.$auth
            .request(endpoint)
            .then(res => {
                return { trip: res }
            })
            .catch(e => {
                error({ statusCode: 404, message: 'Carona não encontrada' })
            })
    }
}
</script>
