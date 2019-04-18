<template>
    <v-layout>
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
                    <div>
                        <h3 class="display-1 mb-0">
                            {{ formattedDatetime }}
                        </h3>
                        <div class="title mt-3 mb-3 font-weight-thin">
                            {{ item.driver.first_name }} da
                            {{ capitalUniversity }}
                        </div>
                        <v-chip small color="green" text-color="white">
                            <v-icon left>
                                attach_money
                            </v-icon>{{ item.price }} reais
                        </v-chip>
                        <v-chip small color="blue" text-color="white">
                            {{ item.seats_left }}
                            Assentos sobrando
                        </v-chip>
                        <v-chip
                        v-if="item.auto_approve"
                        small
                        color="yellow"
                        text-color="black"
                        >
                            <v-icon left>
                                offline_bolt
                            </v-icon>
                            Auto Aprovação
                        </v-chip>
                    </div>
                </v-card-title>
                <v-card-actions>
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex d-flex xs6 sm4>
                                <v-btn
                                color="secondary"
                                ripple
                                raised
                                @click="
                                    showDriverDialog = !showDriverDialog
                                "
                                >
                                    {{ item.driver.first_name }}
                                </v-btn>
                            </v-flex>
                            <v-flex d-flex xs6 sm4>
                                <v-btn
                                color="orange"
                                ripple
                                raised
                                dark
                                @click="showTripDialog = !showTripDialog"
                                >
                                    A carona
                                </v-btn>
                            </v-flex>
                            <v-flex d-flex xs12 sm4>
                                <v-btn
                                color="primary"
                                ripple
                                raised
                                @click="bookDialog = true"
                                >
                                    Reservar!
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-actions>
            </template>
        </BaseCard>
        <BasicDriverDetails :item="item" :show-dialog="showDriverDialog" />
        <BasicTripDetails :item="item" :show-dialog="showTripDialog" />
        <v-dialog v-model="bookDialog" :persistent="booking" max-width="450">
            <v-card>
                <v-container>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        Reservar essa carona?
                    </v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        Você vai reservar
                        {{ seats + ' vaga' + (seats != 1 ? 's' : '')
                        }}<template v-if="!item.auto_approve">
                            , mas {{ item.driver.first_name }} ainda terá que
                            aceitar você na viagem
                        </template>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />

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
        <v-dialog v-model="booked" max-width="450" persistent>
            <v-card>
                <v-container>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        Reserva feita!
                    </v-card-text>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        🎉🎉🎉
                    </v-card-text>
                    <v-card-text class="text-xs-center">
                        <v-btn color="primary" to="/trips/passenger">
                            ver reservas
                        </v-btn>
                    </v-card-text>
                </v-container>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import BaseCard from '~/components/cards/BaseCard.vue'
import BasicTripDetails from '~/components/misc/BasicTripDetails.vue'
import BasicDriverDetails from '~/components/misc/BasicDriverDetails.vue'

export default {
    components: { BaseCard, BasicTripDetails, BasicDriverDetails },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showDriverDialog: false,
            showTripDialog: false,
            booking: false,
            booked: false,
            bookDialog: false,
            copied: false
        }
    },
    computed: {
        formattedDatetime() {
            return this.$moment(this.item.datetime).calendar()
        },
        capitalUniversity() {
            return this.getUniversity(this.item.driver.student.university)
        },
        seats() {
            return this.$store.state.searchData.data.seats_left__gte
        },
        canShare() {
            return Boolean(navigator.share)
        }
    },
    watch: {
        showDriverDialog(n, old) {
            if (!old) {
                setTimeout(() => (this.showDriverDialog = false), 100)
            }
        },
        showTripDialog(n, old) {
            if (!old) {
                setTimeout(() => (this.showTripDialog = false), 100)
            }
        }
    },
    methods: {
        async bookItem() {
            this.booking = true
            try {
                let seats = this.seats
                let endpoint = this.item.url
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
                this.$store.commit('significantEvent/trigger')
            } catch (err) {}
            this.booking = false
        },
        share() {
            let message =
                'Carona pelo Unicaronas \n' +
                this.getOriginText(this.item) +
                ' >> ' +
                this.getDestinationText(this.item) +
                ' \n' +
                this.formattedDatetime +
                ' por R$' +
                this.item.price
            if (this.canShare) {
                navigator
                    .share({
                        text: message,
                        url: '/search/' + this.item.id
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
                        this.item.id
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
<style scoped>
.v-btn--floating.v-btn--fixed,
.v-btn--floating.v-btn--absolute {
    z-index: inherit;
}
</style>
