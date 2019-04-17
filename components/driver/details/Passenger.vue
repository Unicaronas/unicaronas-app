<template>
    <v-list-tile :disabled="loading" avatar ripple @click="dialog = true">
        <v-list-tile-content>
            <v-list-tile-title id="title">
                <b>{{ capitalize(passenger.first_name) }}</b>
                <v-icon size="1em">
                    {{ genderIcon }}
                </v-icon>, {{ age }} anos
                <v-chip
                :color="statusColor"
                class="hidden-xs-only"
                label
                small
                text-color="white"
                >
                    {{ statusText }}
                </v-chip>
            </v-list-tile-title>
            <v-list-tile-sub-title>
                {{ passenger.student.course }} na
                {{ getUniversity(passenger.student.university) }} desde
                {{ passenger.student.enroll_year }}
            </v-list-tile-sub-title>
            <v-list-tile-sub-title>
                Reservou {{ passenger.seats }} assento{{
                    passenger.seats != 1 ? 's' : ''
                }}
            </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
            <v-list-tile-action-text>
                {{ $moment(passenger.book_time).fromNow() }}
            </v-list-tile-action-text>
            <v-icon v-if="!loading">
                {{ actionIcon }}
            </v-icon>
            <v-progress-circular v-else indeterminate color="primary" />
        </v-list-tile-action>
        <v-dialog v-model="dialog" :persistent="loading" max-width="450">
            <v-card>
                <v-container>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        Você quer mesmo {{ actionTextAlt }}
                        {{ passenger.first_name }}?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />

                        <v-btn
                        v-if="!loading"
                        color="primary"
                        flat="flat"
                        @click="dialog = false"
                        >
                            Não, pera
                        </v-btn>

                        <v-btn
                        :loading="loading"
                        :disabled="loading"
                        color="error"
                        flat="flat"
                        @click="callAction()"
                        >
                            {{ actionTextAlt }}
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
    </v-list-tile>
</template>
<script>
export default {
    props: {
        passenger: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            dialog: false
        }
    },
    computed: {
        genderIcon() {
            let map = {
                male: 'fas fa-mars',
                female: 'fas fa-venus',
                na: 'fas fa-rainbow',
                other: 'fas fa-rainbow'
            }
            return map[this.passenger.profile.gender]
        },
        age() {
            return this.$moment().diff(
                this.passenger.profile.birthday,
                'years',
                false
            )
        },
        statusColor() {
            let map = {
                approved: 'green',
                pending: 'orange',
                denied: 'red'
            }
            return map[this.passenger.status]
        },
        statusText() {
            let map = {
                approved: 'Aprovado',
                pending: 'Pendente',
                denied: 'Negado'
            }
            return map[this.passenger.status]
        },
        actionIcon() {
            let map = {
                approved: 'fas fa-user-times',
                pending: 'fas fa-user-check',
                denied: 'fas fa-user-check'
            }
            return map[this.passenger.status]
        },
        actionTextAlt() {
            let map = {
                approved: 'remover',
                pending: 'aprovar',
                denied: 'aprovar'
            }
            return map[this.passenger.status]
        }
    },
    methods: {
        callAction() {
            let map = {
                approved: this.forfeit,
                pending: this.approve,
                denied: this.approve
            }
            return map[this.passenger.status]()
        },
        capitalize(text) {
            if (!text) return
            return text.replace(/^\w/, c => c.toUpperCase())
        },
        async execAction(action) {
            this.loading = true
            let endpoint = this.passenger.url
            let payload = {
                method: 'patch',
                url: endpoint,
                data: {
                    action: action
                }
            }
            try {
                await this.$auth.request(payload)
                this.$store.commit('significantEvent/trigger')
                this.$ga.event('driver', action)
                this.$emit('passengerModified')
            } catch (err) {}
            this.loading = false
            this.dialog = false
        },
        approve() {
            this.execAction('approve')
        },
        forfeit() {
            this.execAction('forfeit')
        }
    }
}
</script>
