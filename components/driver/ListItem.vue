<template>
    <div>
        <BaseCard>
            <template slot="card" slot-scope="theme">
                <v-card-title primary-title>
                    <v-btn
                    color="primary"
                    absolute
                    top
                    right
                    small
                    fab
                    @click="share()"
                    >
                        <v-tooltip v-model="copied" :disabled="!copied" top>
                            <v-icon slot="activator">
                                share
                            </v-icon>
                            <span>Link copiado!</span>
                        </v-tooltip>
                    </v-btn>
                    <v-flex d-flex xs12>
                        <v-alert v-model="error" dismissible type="error">
                            Erro atualizando a carona!
                        </v-alert>
                    </v-flex>
                    <v-flex v-if="pendingPassengers.length" py-2 xs12>
                        <a
                        :href="`/trips/driver/${trip.id}/passengers/`"
                        nuxt
                        style="float: right; width: 100%; text-transform: uppercase;"
                        class="pa-1 headline text-xs-center font-weight-bold white--text orange"
                        >{{ pendingPassengersText }}</a>
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
                        <div class="headline mt-0 mb-3 font-weight-thin" style="display: inline-flex;">
                            <v-layout row wrap>
                                <v-flex mt-1>
                                    Passageiros:
                                    <b>{{ trip.max_seats - trip.seats_left }} de{{ $moment(trip.datetime).isBefore($moment()) ? " " + trip.max_seats : "" }}</b>
                                </v-flex>
                                <template v-if="$moment(trip.datetime).isAfter($moment())">
                                    <div class="max-seats">
                                        <v-select
                                        v-model="seats"
                                        single-line
                                        outline
                                        :dark="
                                            theme.theme.theme_dark ||
                                                theme.theme.theme_text ==
                                                'white--text'
                                        "
                                        :light="theme.theme.theme_light"
                                        :items="seatOptions"
                                        />
                                    </div>
                                </template>
                            </v-layout>
                        </div>
                    </v-flex>
                    <v-flex pt-0 pb-0 xs12>
                        <div class="headline mt-0 mb-3 font-weight-thin">
                            Preço: <b>R${{ trip.price }}</b>
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
                                {{ trip.origin.split('-')[0] }}
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
                                {{ trip.destination.split('-')[0] }}
                            </a>
                        </div>
                    </v-flex>
                </v-card-title>
                <v-card-actions>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex d-flex xs12 sm4>
                                <v-btn
                                :to="`/trips/driver/${trip.id}/`"
                                color="green"
                                class="white--text"
                                ripple
                                nuxt
                                raised
                                >
                                    Detalhes
                                </v-btn>
                            </v-flex>
                            <v-spacer />
                            <v-flex
                            v-if="$moment(trip.datetime).isAfter($moment())"
                            d-flex
                            xs12
                            sm4
                            >
                                <v-btn
                                :loading="deleting"
                                :disabled="deleting"
                                color="red"
                                class="white--text"
                                ripple
                                raised
                                @click="dialog = true"
                                >
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
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        Apagar carona?
                    </v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        Tem certeza? Não há como desfazer isso!
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />

                        <v-btn
                        color="primary"
                        flat="flat"
                        @click="dialog = false"
                        >
                            Não, pera
                        </v-btn>

                        <v-btn color="error" flat="flat" @click="deleteItem()">
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
            error: false,
            mounted: false,
            trip: {},
            seats: 3,
            dialog: false,
            deleting: false,
            pendingPassengers: [],
            copied: false
        }
    },
    computed: {
        canShare() {
            return Boolean(navigator.share)
        },
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
        pendingPassengersText() {
            let pp = this.pendingPassengers
            let s = pp.length != 1 ? 's' : ''
            return `${pp.length} passageiro${s} pendente${s}`
        },
        seatOptions() {
            if (!this.trip.max_seats) {
                return []
            }
            let max = Math.min(this.trip.max_seats + 3, 10)
            return [...Array(max).keys()].slice(Math.max(this.trip.max_seats - this.trip.seats_left, 1))
        },
        originCity() {
            return this.getAddrComp(
                'origin_address_components',
                'administrative_area_level_2',
                'long_name'
            )
        },
        destinationCity() {
            return this.getAddrComp(
                'destination_address_components',
                'administrative_area_level_2',
                'long_name'
            )
        }
    },
    watch: {
        seats(n) {
            if (!this.mounted) {
                return
            }
            this.$auth.request({
                method: 'patch',
                url: this.trip.url,
                data: {
                    max_seats: n
                }
            }).then(response => {
                this.$auth.request(this.trip.url).then(response => {
                    this.trip = response
                })
            }).catch(error => {
                this.error = true
            })
        }
    },
    created() {
        this.trip = this.item
        this.seats = this.trip.max_seats
    },
    async mounted() {
        this.pendingPassengers = await this.getPendingPassengers()
        this.mounted = true
    },
    methods: {
        async getPendingPassengers() {
            if (this.$moment(this.trip.datetime).isBefore(this.$moment())) {
                return []
            }
            let passengers = await this.$auth.request(this.trip.passengers)
            return passengers.results.filter(
                passenger => passenger.status == 'pending'
            )
        },
        async deleteItem() {
            this.deleting = true
            this.dialog = false
            try {
                let endpoint = this.trip.url
                let payload = {
                    method: 'delete',
                    url: endpoint
                }
                await this.$auth.request(payload)
                this.$ga.event('trips', 'delete')
                this.$store.commit('significantEvent/trigger')
                this.$emit('deleteItem', this.trip.id)
            } catch (err) {}
            this.deleting = false
        },
        getAddrComp(source, component, short) {
            // Get the address component from the trip
            if (!this.trip) return ''
            return this.trip[source].filter(comp =>
                comp.types.includes(component)
            )[0][short]
        },
        share() {
            let message =
                '[OFEREÇO]\n' +
                this.originCity +
                ' >> ' +
                this.destinationCity +
                ' \n' +
                this.$moment(this.trip.datetime).calendar() +
                ' por R$' +
                this.trip.price +
                '\nPelo Unicaronas'
            if (this.canShare) {
                navigator
                    .share({
                        text: message,
                        url: '/search/' + this.trip.id
                    })
                    .then(() => {})
                    .catch(error => {})
            } else {
                this.$copyText(
                    message +
                        ' \n' +
                        location.protocol +
                        '//' +
                        location.host +
                        '/search/' +
                        this.trip.id
                )
                    .then(() => {
                        this.copied = true
                        setTimeout(res => (this.copied = false), 3000)
                    })
                    .catch(err => {})
            }
        }
    }
}
</script>
<style>
    .max-seats .v-input__control {
        max-width: 4em;
        font-weight: bold;
    }
    .v-btn--floating.v-btn--fixed,
    .v-btn--floating.v-btn--absolute {
        z-index: inherit;
    }
</style>
