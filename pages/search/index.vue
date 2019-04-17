<template>
    <v-container>
        <v-layout row wrap>
            <v-flex d-flex xs12 mt-5 offset-lg2>
                <h1 class="display-3 font-weight-thin mb-3">
                    Pesquisar caronas
                </h1>
            </v-flex>
            <v-flex d-flex xs12 md4 mt-5 offset-md2>
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
                        pesquisa de caronas, de entrada de caronas e de criação
                        de alarmes.
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
                md4
                lg3
                mt-3
                offset-lg2
                >
                    <Form
                    ref="form"
                    :loading="formLoading"
                    @search="handleSearch"
                    />
                </v-flex>
                <v-flex
                id="searchResults"
                d-flex
                xs12
                mb-5
                md7
                lg5
                mt-3
                offset-md1
                offset-lg2
                >
                    <template v-if="!searchedOnce">
                        <v-layout row align-start justify-start wrap>
                            <v-flex d-flex xs12 text-xs-center text-lg-left>
                                <PastSearches
                                @clicked="$refs.form.manualOriDest($event)"
                                />
                            </v-flex>
                        </v-layout>
                    </template>
                    <template v-else-if="!formLoading">
                        <v-layout
                        v-if="searchResults"
                        row
                        align-start
                        justify-start
                        wrap
                        >
                            <v-flex d-flex xs12 text-xs-center text-lg-left>
                                <SearchStats :count="searchResults.count" />
                            </v-flex>
                            <v-flex
                            v-if="searchResults.count == 0 && !formLoading"
                            d-flex
                            xs12
                            >
                                <AlarmDialog />
                            </v-flex>
                            <v-flex d-flex xs12>
                                <List
                                :reset-infinite="resetInfinite"
                                :items="searchResultsData"
                                :search-type="searchType"
                                @loadMore="loadMore"
                                />
                            </v-flex>
                        </v-layout>
                    </template>
                    <template v-else>
                        <v-container fluid fill-height>
                            <v-layout align-center justify-center>
                                <v-layout row wrap>
                                    <v-flex d-flex xs12>
                                        <h1
                                        class="display-1 font-weight-thin mb-3 text-xs-center"
                                        >
                                            Pesquisando caronas...
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
                    </template>
                </v-flex>
            </template>
        </v-layout>
    </v-container>
</template>

<script>
import Form from '~/components/search/Form.vue'
import List from '~/components/search/List.vue'
import AlarmDialog from '~/components/search/AlarmDialog.vue'
import SearchStats from '~/components/search/SearchStats.vue'
import PastSearches from '~/components/search/PastSearches.vue'
import LoadingPermissions from '~/components/misc/LoadingPermissions.vue'

export default {
    components: { Form, List, AlarmDialog, SearchStats, PastSearches, LoadingPermissions },
    data() {
        return {
            isMounted: false,
            hasScope: false,
            formLoading: false,
            searchResults: null,
            searchResultsData: [],
            searchType: 'local',
            resetInfinite: false,

            error: false,
            errorMessage: '',

            searchedOnce: false
        }
    },
    head() {
        return {
            title: 'Pesquisar - ' + process.env.APP_NAME
        }
    },
    mounted() {
        this.isMounted = true
        this.hasScope =
            this.$auth.hasScope('trips:read') &&
            this.$auth.hasScope('trips:passenger:write') &&
            this.$auth.hasScope('alarms:write')
    },
    methods: {
        genericSearch(endpoint, data) {
            this.searchedOnce = true
            let API_URL =
                process.env.SERVER_URL + '/api/' + process.env.API_VERSION
            let url = API_URL + endpoint
            let payload = {
                method: 'get',
                url: url,
                params: data
            }
            return this.$auth.request(payload)
        },
        localSearch(data) {
            return this.genericSearch('/trips/local/', data)
        },
        externalSearch(data) {
            return this.genericSearch('/trips/external/', data)
        },
        async handleSearch() {
            this.formLoading = true
            let search = this.$store.state.searchData
            try {
                let response =
                    search.endpoint == 'local'
                        ? await this.localSearch(search.data)
                        : await this.externalSearch(search.data)
                this.searchResults = response
                this.searchResultsData = response.results
                this.searchType = search.endpoint
            } catch (err) {
                this.error = true
                this.errorMessage = 'Opa! Algo de errado aconteceu!'
            }
            this.formLoading = false
            this.resetInfinite = true
            setTimeout(() => (this.resetInfinite = false), 100)
        },
        async loadMore($state) {
            let url = this.searchResults.next
            if (url === null) {
                $state.complete()
                return
            }
            try {
                let response = await this.$auth.request({ url: url })
                this.searchResults = response
                this.searchResultsData.push(...response.results)
                $state.loaded()
                if (response.next === null) $state.complete()
            } catch (err) {
                this.error = true
                this.errorMessage = 'Opa! Algo de errado aconteceu!'
                $state.complete()
            }
        }
    }
}
</script>
