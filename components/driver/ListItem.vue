<template>
    <div>
        <BaseCard>
            <template slot="card" slot-scope="theme">
                <v-card-title primary-title>
                    <v-flex v-if="pendingPassengers.length" py-2 xs12>
                        <a :href="`/trips/driver/${item.id}/passengers/`" nuxt style="float: right; width: 100%; text-transform: uppercase;" class="pa-1 headline text-xs-center font-weight-bold white--text orange">{{ pendingPassengersText }}</a>
                    </v-flex>
                    <v-flex pt-0 pb-0 xs12>
                        <div class="display-1 mt-0 mb-3 font-weight-thin">
                            {{ formattedDatetime }}
                        </div>
                    </v-flex>
                    <v-flex pt-0 xs12>
                        <v-divider />
                    </v-flex>
                    <v-flex pt-0 pb-0 xs12>
                        <div class="headline mt-0 mb-3 font-weight-thin">
                            Passageiros: <b>{{ item.max_seats - item.seats_left }} de {{ item.max_seats }}</b>
                        </div>
                    </v-flex>
                    <v-flex pt-0 pb-0 xs12>
                        <div class="headline mt-0 mb-3 font-weight-thin">
                            Preço: <b>R${{ item.price }}</b>
                        </div>
                    </v-flex>
                    <v-flex pt-0 xs12>
                        <v-divider />
                    </v-flex>
                    <v-flex pb-0 xs12>
                        <h3 class="headline mb-0">
                            Saída
                        </h3>
                    </v-flex>
                    <v-flex pt-0 xs12>
                        <div class="title mt-0 mb-3 font-weight-thin">
                            <a :href="originURL" target="_blank">
                                {{ item.origin.split('-')[0] }}
                            </a>
                        </div>
                    </v-flex>
                    <v-flex pb-0 xs12>
                        <h3 class="headline mb-0">
                            Chegada
                        </h3>
                    </v-flex>
                    <v-flex pt-0 xs12>
                        <div class="title mt-0 mb-3 font-weight-thin">
                            <a :href="destinationURL" target="_blank">
                                {{ item.destination.split('-')[0] }}
                            </a>
                        </div>
                    </v-flex>
                </v-card-title>
                <v-card-actions>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex d-flex xs12 sm4>
                                <v-btn
                                :to="`/trips/driver/${item.id}/`"
                                color="green"
                                class="white--text"
                                ripple
                                nuxt
                                raised>
                                    Detalhes
                                </v-btn>
                            </v-flex>
                            <v-spacer/>
                            <v-flex v-if="$moment(item.datetime).isAfter($moment())" d-flex xs12 sm4>
                                <v-btn
                                :loading="deleting"
                                :disabled="deleting"
                                color="red"
                                class="white--text"
                                ripple
                                raised
                                @click="dialog = true">
                                    Apagar
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-actions>
            </template>
        </BaseCard>
        <v-dialog v-model="dialog" max-width="450">
            <v-card>
                <v-container>
                    <v-card-text class="display-1 font-weight-thin text-xs-center">Apagar carona?</v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        Tem certeza? Não há como desfazer isso!
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>

                        <v-btn color="primary" flat="flat" @click="dialog = false" >
                            Não, pera
                        </v-btn>

                        <v-btn color="error" flat="flat" @click="deleteItem()" >
                            Apagar!
                        </v-btn>
                    </v-card-actions>
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
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            deleting: false,
            pendingPassengers: []
        }
    },
    computed: {
        formattedDatetime() {
            return this.$moment(this.item.datetime).calendar()
        },
        originURL() {
            return (
                'https://www.google.com/maps/place/' +
                this.item.origin_coordinates.latitude +
                ',' +
                this.item.origin_coordinates.longitude
            )
        },
        destinationURL() {
            return (
                'https://www.google.com/maps/place/' +
                this.item.destination_coordinates.latitude +
                ',' +
                this.item.destination_coordinates.longitude
            )
        },
        pendingPassengersText() {
            let pp = this.pendingPassengers
            let s = pp.length != 1 ? 's' : ''
            return `${pp.length} passageiro${s} pendente${s}`
        }
    },
    async mounted() {
        this.pendingPassengers = await this.getPendingPassengers()
    },
    methods: {
        async getPendingPassengers() {
            if (this.$moment(this.item.datetime).isBefore(this.$moment())) {
                return []
            }
            let passengers = await this.$auth.request(this.item.passengers)
            return passengers.results.filter(
                passenger => passenger.status == 'pending'
            )
        },
        async deleteItem() {
            this.deleting = true
            this.dialog = false
            try {
                let endpoint = this.item.url
                let payload = {
                    method: 'delete',
                    url: endpoint
                }
                await this.$auth.request(payload)
                this.$ga.event('trips', 'delete')
                this.$emit('deleteItem', this.item.id)
            } catch (err) {}
            this.deleting = false
        }
    }
}
</script>
