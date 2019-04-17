<template>
    <v-container>
        <v-layout row wrap>
            <v-flex d-flex xs12 mt-5 offset-lg2>
                <h1 class="display-2 font-weight-thin">
                    Seus alarmes
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
                        leitura e criação de alarmes.
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
                    v-if="alarmList"
                    row
                    align-start
                    justify-start
                    wrap
                    >
                        <v-flex d-flex class="text-xs-center" xs12>
                            <AlarmStats :count="alarmList.count" />
                        </v-flex>
                        <v-flex
                        v-if="alarmList.count == 0"
                        d-flex
                        class="text-xs-center"
                        lg6
                        offset-lg3
                        xs12
                        >
                            <AlarmDialog />
                        </v-flex>
                        <v-flex d-flex xs12>
                            <List
                            :items="alarmListData"
                            :reset-infinite="resetInfinite"
                            @loadMore="loadMore"
                            @item-deleted="alarmDeleted"
                            />
                        </v-flex>
                    </v-layout>
                    <v-container v-else-if="!error" fluid fill-height>
                        <v-layout align-center justify-center>
                            <v-layout row wrap>
                                <v-flex d-flex xs12>
                                    <h1
                                    class="display-1 font-weight-thin mb-3 text-xs-center"
                                    >
                                        Carregando alarmes...
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
import List from '~/components/alarms/List.vue'
import AlarmDialog from '~/components/alarms/AlarmDialog.vue'
import AlarmStats from '~/components/alarms/AlarmStats.vue'
import LoadingPermissions from '~/components/misc/LoadingPermissions.vue'

export default {
    components: { List, AlarmDialog, AlarmStats, LoadingPermissions },
    data() {
        return {
            isMounted: false,
            hasScope: false,
            alarmList: null,
            alarmListData: [],
            resetInfinite: false,

            error: false,
            errorMessage: ''
        }
    },
    head() {
        return {
            title: 'Alarmes - ' + process.env.APP_NAME
        }
    },
    mounted() {
        this.isMounted = true
        this.hasScope =
            this.$auth.hasScope('alarms:read') &&
            this.$auth.hasScope('alarms:write')
        if (this.hasScope) {
            this.getAlarms()
        }
    },
    methods: {
        async getAlarms() {
            let API_URL =
                process.env.SERVER_URL + '/api/' + process.env.API_VERSION

            let endpoint = API_URL + '/alarms/'
            try {
                this.alarmList = await this.$auth.request(endpoint)
                this.alarmListData = this.alarmList.results
            } catch (err) {
                this.error = true
                this.errorMessage =
                    'Aconteceu um problema durante o carregamento da lista de alarmes'
            }
        },
        async loadMore($state) {
            let url = this.alarmList.next
            if (url === null) {
                $state.complete()
                return
            }
            try {
                let response = await this.$auth.request({ url: url })
                this.alarmList = response
                this.alarmListData.push(...response.results)
                $state.loaded()
                if (response.next === null) $state.complete()
            } catch (err) {
                this.error = true
                this.errorMessage = 'Opa! Algo de errado aconteceu!'
                $state.complete()
            }
        },
        alarmDeleted(alarm_id) {
            let index = this.alarmListData.findIndex(
                alarm => alarm.id == alarm_id
            )
            if (index >= 0) {
                this.alarmListData.splice(index, 1)
                this.alarmList.count--
            }
        }
    }
}
</script>
