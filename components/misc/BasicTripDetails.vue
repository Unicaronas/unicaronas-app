<template>
    <v-layout row justify-center>
        <template v-if="$device.isMobile">
            <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            >
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click.native="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Sobre a carona</v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex v-if="item.details" d-flex xs12>
                                <v-card-text
                                style="white-space: pre;"
                                class="pb-1 headline font-weight-regular font-italic"
                                >
                                    <ReadMore :text="item.details" />
                                </v-card-text>
                            </v-flex>
                            <v-flex v-if="item.details" d-flex xs12>
                                <v-card-text
                                class="pt-1 title font-weight-thin"
                                >
                                    - {{ firstName }}
                                </v-card-text>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-title
                                class="pb-0 headline font-weight-thin"
                                >
                                    Vai custar {{ item.price }} reais e
                                    {{ autoApproveText }}. Além disso,
                                    {{ seatsLeftText }}.
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-title
                                class="pb-0 headline font-weight-thin"
                                >
                                    Dia e hora:
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-text
                                class="title pt-1 font-weight-bold"
                                >
                                    {{ formattedDatetime }}.
                                </v-card-text>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-title
                                class="pb-0 headline font-weight-thin"
                                >
                                    Endereço aproximado de saída:
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-text
                                class="pt-0 title font-weight-light"
                                >
                                    <a :href="originURL" target="_blank">{{
                                        item.origin
                                    }}</a>
                                </v-card-text>
                            </v-flex>
                            <v-flex d-flex mt-1 xs12>
                                <v-card-title
                                class="pb-0 headline font-weight-thin"
                                >
                                    Endereço aproximado de chegada:
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-text
                                class="pt-0 title font-weight-light"
                                >
                                    <a :href="destinationURL" target="_blank">{{
                                        item.destination
                                    }}</a>
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-dialog>
        </template>
        <template v-else>
            <v-dialog v-model="dialog" max-width="768">
                <v-card>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex d-flex xs12>
                                <v-card-title
                                class="display-1 font-weight-thin"
                                >
                                    Sobre a carona
                                </v-card-title>
                            </v-flex>
                            <v-flex v-if="item.details" d-flex xs12>
                                <v-card-text
                                class="pb-1 headline font-weight-regular font-italic"
                                >
                                    <ReadMore :text="item.details" />
                                </v-card-text>
                            </v-flex>
                            <v-flex v-if="item.details" d-flex xs12>
                                <v-card-text
                                class="pt-1 title font-weight-thin"
                                >
                                    - {{ firstName }}
                                </v-card-text>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-title
                                class="pb-0 headline font-weight-thin"
                                >
                                    Vai custar {{ item.price }} reais e
                                    {{ autoApproveText }}. Além disso,
                                    {{ seatsLeftText }}.
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-title
                                class="pb-0 headline font-weight-thin"
                                >
                                    Dia e hora:
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-text
                                class="title pt-1 font-weight-bold"
                                >
                                    {{ formattedDatetime }}.
                                </v-card-text>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-title
                                class="pb-0 headline font-weight-thin"
                                >
                                    Endereço aproximado de saída:
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-text
                                class="pt-0 title font-weight-light"
                                >
                                    <a :href="originURL" target="_blank">{{
                                        item.origin
                                    }}</a>
                                </v-card-text>
                            </v-flex>
                            <v-flex d-flex mt-1 xs12>
                                <v-card-title
                                class="pb-0 headline font-weight-thin"
                                >
                                    Endereço aproximado de
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-text
                                class="pt-0 title font-weight-light"
                                >
                                    <a :href="destinationURL" target="_blank">{{
                                        item.destination
                                    }}</a>
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-dialog>
        </template>
    </v-layout>
</template>
<script>
import ReadMore from '~/components/misc/ReadMore.vue'

export default {
    components: { ReadMore },
    props: {
        showDialog: {
            type: Boolean,
            required: true
        },
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            notifications: false,
            sound: true,
            widgets: false
        }
    },
    computed: {
        formattedDatetime() {
            return this.$moment(this.item.datetime).calendar()
        },
        capitalUniversity() {
            return this.getUniversity(this.item.driver.student.university)
        },
        yearsOld() {
            return this.$moment().diff(
                this.item.driver.profile.birthday,
                'years',
                false
            )
        },
        genderNounEnd() {
            let map = {
                male: 'o',
                female: 'a',
                other: 'x',
                na: 'x'
            }
            return map[this.item.driver.profile.gender]
        },
        genderNoun() {
            let map = {
                male: 'ele',
                female: 'ela',
                other: 'elx',
                na: 'elx'
            }
            return map[this.item.driver.profile.gender]
        },
        firstName() {
            return this.item.driver.first_name
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
        autoApproveText() {
            return this.item.auto_approve
                ? 'a aprovação nela é automática'
                : this.firstName + ' vai ter que aprovar sua entrada'
        },
        seatsLeftText() {
            return this.item.seats_left == 1
                ? 'tem só uma vaga sobrando'
                : 'tem ' + this.item.seats_left + ' vagas sobrando'
        }
    },
    watch: {
        showDialog(n, o) {
            if (!o) {
                this.dialog = true
            }
        }
    },
    methods: {
        capitalize(text) {
            if (!text) return
            return text.replace(/^\w/, c => c.toUpperCase())
        }
    }
}
</script>
