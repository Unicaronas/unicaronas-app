<template>
    <div>
        <BaseCard>
            <template slot="card" slot-scope="theme">
                <v-card-title primary-title>
                    <v-flex py-2 xs12>
                        <span
                        :class="statusColor"
                        style="float: right; width: 100%; text-transform: uppercase;"
                        class="pa-1 headline text-xs-center font-weight-bold white--text"
                        >{{ statusText }}</span>
                    </v-flex>
                    <v-flex xs12 pt-3>
                        <v-container>
                            <v-flex xs12 text-xs-center>
                                <div
                                class="headline text-xs-center font-weight-thin"
                                >
                                    Você reservou <b>{{ trip.seats }}</b> vaga{{
                                        trip.seats != 1 ? 's' : ''
                                    }}
                                    por
                                    <b>R${{ trip.price * trip.seats }}</b> nessa
                                    carona
                                </div>
                                <br>
                                <v-btn
                                v-if="
                                    trip.status != 'denied' &&
                                        $moment(trip.datetime).isAfter(
                                            $moment()
                                        )
                                "
                                large
                                ripple
                                color="error"
                                @click="dialog = true"
                                >
                                    Desistir
                                </v-btn>
                            </v-flex>
                        </v-container>
                    </v-flex>
                </v-card-title>
            </template>
        </BaseCard>
        <v-dialog v-model="dialog" :persistent="givingUp" max-width="450">
            <v-card>
                <v-container>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        Desistir da carona?
                    </v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        Tem certeza? Você não poderá viajar nela!
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />

                        <v-btn
                        v-if="!givingUp"
                        color="primary"
                        flat="flat"
                        @click="dialog = false"
                        >
                            Não, pera
                        </v-btn>

                        <v-btn
                        :loading="givingUp"
                        :disabled="givingUp"
                        color="error"
                        flat="flat"
                        @click="giveUp()"
                        >
                            Desistir!
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="gaveUp" max-width="450" persistent>
            <v-card>
                <v-container>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        Pronto!
                    </v-card-text>
                    <v-card-text class="text-xs-center">
                        <v-btn color="primary" to="/trips/passenger">
                            voltar
                        </v-btn>
                    </v-card-text>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import BaseCard from '~/components/cards/BaseCard.vue'

export default {
    components: { BaseCard },
    props: {
        trip: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            givingUp: false,
            gaveUp: false,
            dialog: false
        }
    },
    computed: {
        formattedDatetime() {
            return this.$moment(this.trip.datetime).calendar()
        },
        originURL() {
            return (
                'https://www.google.com/maps/place/' +
                this.trip.origin_coordinates.latitude +
                ',' +
                this.trip.origin_coordinates.longitude
            )
        },
        destinationURL() {
            return (
                'https://www.google.com/maps/place/' +
                this.trip.destination_coordinates.latitude +
                ',' +
                this.trip.destination_coordinates.longitude
            )
        },
        seatOptions() {
            let numbers = [...Array(this.trip.seats_left + 1).keys()].slice(1)
            let items = []
            for (let i in numbers) {
                let number = numbers[i]
                let item = { text: number + ' Vaga', value: number }
                if (number != 1) item.text += 's'
                items.push(item)
            }
            return items
        },
        statusColor() {
            let map = {
                approved: 'green',
                pending: 'orange',
                denied: 'red'
            }
            return map[this.trip.status]
        },
        statusText() {
            let map = {
                approved: 'Aprovada',
                pending: 'Pendente',
                denied: 'Negada'
            }
            return map[this.trip.status]
        }
    },
    methods: {
        async giveUp() {
            this.givingUp = true
            try {
                let endpoint = this.trip.url
                let payload = {
                    method: 'patch',
                    url: endpoint,
                    data: {
                        action: 'give_up'
                    }
                }
                await this.$auth.request(payload)
                this.$store.commit('significantEvent/trigger')
                this.$ga.event('passenger', 'give-up')
                this.dialog = false
                this.gaveUp = true
            } catch (err) {}
            this.givingUp = false
        }
    }
}
</script>
