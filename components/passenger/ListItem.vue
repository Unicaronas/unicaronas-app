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
                    <v-flex py-2 xs12>
                        <span
                        :class="statusColor"
                        style="float: right; width: 100%; text-transform: uppercase;"
                        class="pa-1 headline text-xs-center font-weight-bold white--text"
                        >{{ statusText }}</span>
                    </v-flex>
                    <v-flex pt-0 pb-0 xs12>
                        <div class="display-1 mt-0 mb-3 font-weight-thin">
                            {{ formattedDatetime }}
                        </div>
                    </v-flex>
                    <v-flex pt-0 mt-0 xs12>
                        <div class="headline mt-0 mb-0 font-weight-thin">
                            {{ seatsPriceText }}
                        </div>
                    </v-flex>
                    <v-flex v-if="item.status == 'approved'" pt-0 xs12>
                        <div class="title mt-0 mb-3 font-weight-thin">
                            {{ otherPassengersText }}
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
                    <v-flex v-if="item.details" pt-0 xs12>
                        <div class="title mt-0 font-weight-thin font-italics">
                            <ReadMore :text="item.details" />
                        </div>
                    </v-flex>
                    <v-flex pt-0 xs12>
                        <v-divider />
                    </v-flex>
                    <v-flex pt-0 xs12>
                        <div class="headline mt-0 mb-3 font-weight-light">
                            Motorista:
                        </div>
                    </v-flex>
                    <v-flex pt-0 xs12>
                        <div class="title mt-0 mb-3 font-weight-light">
                            <v-avatar
                            v-if="driver.profile.picture.medium_128"
                            class="mr-3"
                            size="80"
                            >
                                <v-img
                                :src="driver.profile.picture.medium_128"
                                contain
                                />
                            </v-avatar>
                            <b>{{ driver.first_name }}</b>
                            <template v-if="item.status == 'approved'">
                                <br><br><v-tooltip top>
                                    <span
                                    slot="activator"
                                    style="cursor: pointer;"
                                    @click="copyPhone()"
                                    ><b>{{
                                         formatPhone(
                                             item.driver.profile.phone
                                         )
                                     }}</b>
                                        <v-icon>fas fa-copy</v-icon></span><span>{{ copyText }}</span>
                                </v-tooltip><br><br>Carro:
                                <b>{{ item.driver.driver.car_make }}
                                    {{ item.driver.driver.car_model }}
                                    {{ item.driver.driver.car_color }}</b>
                            </template>
                        </div>
                    </v-flex>
                </v-card-title>
                <v-card-actions>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex d-flex xs12 sm4>
                                <v-btn
                                :to="`/trips/passenger/${item.id}/`"
                                color="green"
                                class="white--text"
                                ripple
                                nuxt
                                raised
                                >
                                    detalhes
                                </v-btn>
                            </v-flex>
                            <v-spacer />
                            <v-flex
                            v-if="
                                item.status != 'denied' &&
                                    $moment(item.datetime).isAfter(
                                        $moment()
                                    )
                            "
                            d-flex
                            xs12
                            sm4
                            >
                                <v-btn
                                :loading="givingUp"
                                :disabled="givingUp"
                                color="red"
                                class="white--text"
                                ripple
                                raised
                                @click="dialog = true"
                                >
                                    Desistir
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
                        Desistir da carona?
                    </v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        Tem certeza? Você não poderá viajar nela!
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

                        <v-btn color="error" flat="flat" @click="giveUp()">
                            Desistir!
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import BaseCard from '~/components/cards/BaseCard.vue'
import ReadMore from '~/components/misc/ReadMore.vue'

export default {
    components: { BaseCard, ReadMore },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            givingUp: false,
            copyText: 'copiar',
            copied: false
        }
    },
    computed: {
        canShare() {
            return Boolean(navigator.share)
        },
        formattedDatetime() {
            return this.$moment(this.item.datetime).calendar()
        },
        seatsPriceText() {
            let text
            if (this.item.seats != 1)
                text = this.item.seats + ' assentos reservados por R$'
            else text = '1 assento reservado por R$'
            text += this.item.seats * this.item.price
            return text
        },
        otherPassengersText() {
            let text
            if (this.item.approved_passengers.length > 2)
                text =
                    this.item.approved_passengers.length +
                    ' outras pessoas na carona'
            else if (this.item.approved_passengers.length == 2)
                text = 'Uma outra pessoa na carona'
            else text = 'Só você na carona'
            return text
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
        statusColor() {
            let map = {
                approved: 'green',
                pending: 'orange',
                denied: 'red'
            }
            return map[this.item.status]
        },
        statusText() {
            let map = {
                approved: 'Aprovada',
                pending: 'Pendente',
                denied: 'Negada'
            }
            return map[this.item.status]
        },
        driver() {
            if (this.item.status == 'approved') return this.item.driver
            return this.item.driver_basic
        }
    },
    methods: {
        async giveUp() {
            this.givingUp = true
            this.dialog = false
            try {
                let endpoint = this.item.url
                let payload = {
                    method: 'patch',
                    url: endpoint,
                    data: {
                        action: 'give_up'
                    }
                }
                await this.$auth.request(payload)
                this.$ga.event('passenger', 'give-up')
                this.$store.commit('significantEvent/trigger')
                this.$emit('giveUp', this.item.id)
            } catch (err) {}
            this.givingUp = false
        },
        formatPhone(phone) {
            if (phone.startsWith('+55')) phone = phone.slice(3)
            if (phone.length == 11)
                phone = `(${phone.slice(0, 2)})${phone.slice(
                    2,
                    7
                )}-${phone.slice(7)}`
            else if (phone.length == 9)
                phone = `${phone.slice(0, 5)}-${phone.slice(5)}`
            return phone
        },
        copyPhone() {
            this.$copyText(this.formatPhone(this.item.driver.profile.phone))
            this.copyText = 'copiado!'
        },
        share() {
            let message =
                'Carona pelo Unicaronas\n' +
                this.getOriginText(this.item) +
                ' >> ' +
                this.getDestinationText(this.item) +
                ' \n' +
                this.$moment(this.item.datetime).calendar() +
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
<style>
    .v-btn--floating.v-btn--fixed,
    .v-btn--floating.v-btn--absolute {
        z-index: inherit;
    }
</style>
