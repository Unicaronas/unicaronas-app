<template>
    <div>
        <BaseCard>
            <template slot="card" slot-scope="theme">
                <v-card-title primary-title>
                    <v-flex pb-0 xs6>
                        <h3 class="display-2 text-xs-center">R${{ trip.price }}</h3>
                        <label
                        :class="{'text--lighten-2': theme.theme.theme_text == 'white--text', 'text--darken-2': theme.theme.theme_text == 'black--text'}"
                        aria-hidden="true"
                        class="v-label text-xs-center grey--text"
                        style="left: 0px; right: auto; position: relative;"><div>Por vaga</div></label>
                    </v-flex>
                    <v-flex pb-0 xs6>
                        <h3 class="display-2 text-xs-center">{{ trip.seats_left }}</h3>
                        <label
                        :class="{'text--lighten-2': theme.theme.theme_text == 'white--text', 'text--darken-2': theme.theme.theme_text == 'black--text'}"
                        aria-hidden="true"
                        class="v-label text-xs-center grey--text"
                        style="left: 0px; right: auto; position: relative;"><div>Vaga{{ trip.seats_left != 1 ? 's' : '' }} sobrando</div></label>
                    </v-flex>
                    <v-flex xs12 pt-3>
                        <v-container>
                            <v-flex xs12 text-xs-center>
                                <div v-if="trip.auto_approve" class="body text-xs-center">Sua reserva será aprovada <b>automaticamente</b></div>
                                <v-flex xs12 sm6 offset-sm3 md8 offset-md2>
                                    <v-select
                                    :dark="theme.theme.theme_dark || theme.theme.theme_text == 'white--text'"
                                    :light="theme.theme.theme_light"
                                    :items="seatOptions"
                                    v-model="seats"
                                    label="Número de vagas"/>
                                </v-flex>
                                <v-btn large ripple color="primary" @click="bookDialog = true">Reservar</v-btn>
                            </v-flex>
                        </v-container>
                    </v-flex>
                </v-card-title>
            </template>
        </BaseCard>
        <v-dialog
        :persistent="booking"
        v-model="bookDialog"
        max-width="450"
        >
            <v-card>
                <v-container>
                    <v-card-text class="display-1 font-weight-thin text-xs-center">Reservar essa carona?</v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        Você vai reservar {{ seats + ' vaga' + (seats != 1 ? 's' : '') }}<template v-if="!trip.auto_approve">, mas {{ trip.driver.first_name }} ainda terá que aceitar você na viagem</template>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>

                        <v-btn
                        v-if="!booking"
                        color="secondary"
                        flat="flat"
                        big
                        @click="bookDialog = false"
                        >
                            Não, pera
                        </v-btn>

                        <v-btn
                        :loading="booking"
                        :disabled="booking"
                        color="primary"
                        big
                        flat="flat"
                        @click="bookItem()"
                        >
                            Reservar!
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog
        v-model="booked"
        max-width="450"
        persistent
        >
            <v-card>
                <v-container>
                    <v-card-text class="display-1 font-weight-thin text-xs-center">Reserva feita!</v-card-text>
                    <v-card-text class="display-1 font-weight-thin text-xs-center">🎉🎉🎉</v-card-text>
                    <v-card-text
                    class="text-xs-center">
                        <v-btn color="primary" to="/trips/passenger">
                            ver reservas
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
            booking: false,
            booked: false,
            bookDialog: false,
            seats: 1
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
        }
    },
    methods: {
        async bookItem() {
            this.booking = true
            try {
                let seats = this.seats
                let endpoint = this.trip.url
                let payload = {
                    method: 'patch',
                    data: {
                        action: 'book',
                        seats: seats
                    },
                    url: endpoint
                }
                await this.$auth.request(payload)
                this.bookDialog = false
                this.booked = true
                this.$ga.event('trips', 'book')
                this.$fb.track('Book')
            } catch (err) {}
            this.booking = false
        }
    }
}
</script>
