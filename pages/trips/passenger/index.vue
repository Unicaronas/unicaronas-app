<template>
    <v-container>
        <v-layout row wrap>
            <v-flex d-flex xs12 mt-5 offset-lg2>
                <h1 class="display-2 font-weight-thin">
                    Caronas pegas
                </h1>
            </v-flex>
            <v-flex d-flex xs12 md4 />
            <v-flex d-flex xs12 lg8 mt-5 offset-lg2>
                <v-alert v-model="error" dismissible type="error">
                    {{ errorMessage }}
                </v-alert>
            </v-flex>
            <v-flex d-flex xs12 md4 />
            <LoadingPermissions v-if="!isMounted" />
            <template v-else-if="!hasScope">
                <v-flex d-flex xs12 md8 mt-5 offset-md2>
                    <v-alert value="true" type="error">
                        <b>Algumas permissões estão faltando</b>. Por favor,
                        refaça o login e aceite pelo menos as permissões de
                        informações sobre suas caronas e de entrada e saída
                        delas.
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
                lg8
                offset-lg2
                mt-3
                >
                    <v-layout
                    v-if="currentResults && oldResults"
                    row
                    align-start
                    justify-start
                    wrap
                    >
                        <v-flex d-flex offset-md2 md8 xs12>
                            <v-tabs centered grow icons-and-text>
                                <v-tabs-slider color="primary" />

                                <v-tab href="#tab-current">
                                    atuais
                                    <v-badge right>
                                        <span slot="badge">{{
                                            currentResults.count
                                        }}</span>
                                        <v-icon>today</v-icon>
                                    </v-badge>
                                </v-tab>

                                <v-tab href="#tab-old">
                                    passadas
                                    <v-badge right>
                                        <span slot="badge">{{
                                            oldResults.count
                                        }}</span>
                                        <v-icon>event_available</v-icon>
                                    </v-badge>
                                </v-tab>

                                <v-tab-item :value="'tab-current'">
                                    <v-flex
                                    v-if="currentResults.count == 0"
                                    d-flex
                                    class="text-xs-center"
                                    lg6
                                    offset-lg3
                                    xs12
                                    >
                                        <TripDialog />
                                    </v-flex>
                                    <v-flex d-flex xs12>
                                        <List
                                        :items="currentData"
                                        :reset-infinite="
                                            resetInfiniteCurrent
                                        "
                                        @loadMore="loadMoreCurrent"
                                        @giveUp="giveUp"
                                        />
                                    </v-flex>
                                </v-tab-item>
                                <v-tab-item :value="'tab-old'">
                                    <v-flex
                                    v-if="oldResults.count == 0"
                                    d-flex
                                    class="text-xs-center"
                                    lg6
                                    offset-lg3
                                    xs12
                                    >
                                        <TripDialog />
                                    </v-flex>
                                    <v-flex d-flex xs12>
                                        <List
                                        :items="oldData"
                                        :reset-infinite="resetInfiniteOld"
                                        @loadMore="loadMoreOld"
                                        />
                                    </v-flex>
                                </v-tab-item>
                            </v-tabs>
                        </v-flex>
                    </v-layout>
                    <v-container v-else-if="!error" fluid fill-height>
                        <v-layout align-center justify-center>
                            <v-layout row wrap>
                                <v-flex d-flex xs12>
                                    <h1
                                    class="display-1 font-weight-thin mb-3 text-xs-center"
                                    >
                                        Carregando caronas...
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
import List from '~/components/passenger/List.vue'
import TripDialog from '~/components/passenger/TripDialog.vue'
import LoadingPermissions from '~/components/misc/LoadingPermissions.vue'

export default {
    components: { List, TripDialog, LoadingPermissions },
    data() {
        return {
            isMounted: false,
            hasScope: false,
            resetInfiniteCurrent: false,
            resetInfiniteOld: false,

            currentResults: null,
            currentData: [],

            oldResults: null,
            oldData: [],

            error: false,
            errorMessage: ''
        }
    },
    head() {
        return {
            title: 'Caronas pegas - ' + process.env.APP_NAME
        }
    },
    mounted() {
        this.isMounted = true
        this.hasScope =
            this.$auth.hasScope('trips:passenger:read') &&
            this.$auth.hasScope('trips:passenger:write')
        if (this.hasScope) {
            this.getOld()
            this.getCurrent()
        }
    },
    methods: {
        async getOld() {
            let API_URL =
                process.env.SERVER_URL + '/api/' + process.env.API_VERSION

            let endpoint = API_URL + '/trips/passenger/'
            let payload = {
                method: 'get',
                url: endpoint,
                params: {
                    datetime__lte: this.$moment()
                        .subtract(1, 'days')
                        .format(),
                    ordering: '-datetime'
                }
            }
            try {
                this.oldResults = await this.$auth.request(payload)
                this.oldData = this.oldResults.results
            } catch (err) {
                this.error = true
                this.errorMessage =
                    'Aconteceu um problema durante o carregamento da lista de caronas passadas'
            }
        },
        async getCurrent() {
            let API_URL =
                process.env.SERVER_URL + '/api/' + process.env.API_VERSION

            let endpoint = API_URL + '/trips/passenger/'
            let payload = {
                method: 'get',
                url: endpoint,
                params: {
                    datetime__gte: this.$moment()
                        .subtract(1, 'days')
                        .format(),
                    ordering: 'datetime'
                }
            }
            try {
                this.currentResults = await this.$auth.request(payload)
                this.currentData = this.currentResults.results
            } catch (err) {
                this.error = true
                this.errorMessage =
                    'Aconteceu um problema durante o carregamento da lista de caronas atuais'
            }
        },
        async loadMoreOld($state) {
            let url = this.oldResults.next
            if (url === null) {
                $state.complete()
                return
            }
            try {
                let response = await this.$auth.request({ url: url })
                this.oldResults = response
                this.oldData.push(...response.results)
                $state.loaded()
                if (response.next === null) $state.complete()
            } catch (err) {
                this.error = true
                this.errorMessage = 'Opa! Algo de errado aconteceu!'
                $state.complete()
            }
        },
        async loadMoreCurrent($state) {
            let url = this.currentResults.next
            if (url === null) {
                $state.complete()
                return
            }
            try {
                let response = await this.$auth.request({ url: url })
                this.currentResults = response
                this.currentData.push(...response.results)
                $state.loaded()
                if (response.next === null) $state.complete()
            } catch (err) {
                this.error = true
                this.errorMessage = 'Opa! Algo de errado aconteceu!'
                $state.complete()
            }
        },
        giveUp(trip_id) {
            this.currentData.splice(
                this.currentData.findIndex(trip => trip.id == trip_id),
                1
            )
            this.currentResults.count--
        }
    }
}
</script>
