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
                    <v-flex pb-0 xs12>
                        <h3 class="display-1 mb-0">
                            {{ item.first_name }} {{ item.last_name }}
                            <v-icon
                            :dark="
                                theme.theme.theme_dark ||
                                    theme.theme.theme_text == 'white--text'
                            "
                            :light="theme.theme.theme_light"
                            size="1em"
                            >
                                {{ genderIcon }}
                            </v-icon>
                        </h3>
                        <v-flex xs12>
                            <div class="title mb-0 font-weight-thin">
                                {{ age }} anos
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex xs12>
                        <v-flex xs12 py-2>
                            <v-divider />
                        </v-flex>
                        <v-flex xs12>
                            <div class="headline mb-0 font-weight-thin">
                                Contato
                            </div>
                        </v-flex>
                        <v-flex xs12>
                            <div class="title mb-0 font-weight-thin">
                                Celular:
                                <v-tooltip top>
                                    <span
                                    slot="activator"
                                    style="cursor: pointer;"
                                    @click="copyPhone()"
                                    ><b>{{
                                         formatPhone(item.profile.phone)
                                     }}</b>
                                        <v-icon>fas fa-copy</v-icon></span><span>{{ copyText }}</span>
                                </v-tooltip>
                            </div>
                        </v-flex>
                        <v-flex xs12 py-2>
                            <v-divider />
                        </v-flex>
                        <v-flex xs12>
                            <div class="headline mb-0 font-weight-thin">
                                Pedido
                            </div>
                        </v-flex>
                        <v-flex xs12>
                            <div class="title mb-0 font-weight-thin">
                                Vagas: <b>{{ item.seats }}</b>
                            </div>
                            <div class="title mb-0 font-weight-thin">
                                Reservou
                                <b>{{ $moment(item.book_time).fromNow() }}</b>
                            </div>
                        </v-flex>
                    </v-flex>
                    <v-flex xs12>
                        <v-flex xs12 py-2>
                            <v-divider />
                        </v-flex>
                        <v-flex xs12>
                            <div class="headline mb-0 font-weight-thin">
                                Ensino
                            </div>
                        </v-flex>
                        <v-flex xs12>
                            <div class="title mb-0 font-weight-thin">
                                <b>{{
                                    getUniversity(item.student.university)
                                }}</b>
                            </div>
                        </v-flex>
                        <v-flex xs12>
                            <div class="title mb-0 font-weight-thin">
                                <b>{{ capitalize(item.student.course) }}
                                    {{ item.student.enroll_year }}</b>
                            </div>
                        </v-flex>
                    </v-flex>
                </v-card-title>
                <v-card-actions>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex
                            v-if="item.status != 'approved'"
                            d-flex
                            xs12
                            sm4
                            >
                                <v-btn
                                :loading="loading"
                                :disabled="loading"
                                color="green"
                                class="white--text"
                                ripple
                                raised
                                @click="callAction('approve')"
                                >
                                    Aprovar
                                </v-btn>
                            </v-flex>
                            <v-spacer />
                            <v-flex
                            v-if="item.status == 'pending'"
                            d-flex
                            xs12
                            sm4
                            >
                                <v-btn
                                :loading="loading"
                                :disabled="loading"
                                color="red"
                                class="white--text"
                                ripple
                                raised
                                @click="callAction('deny')"
                                >
                                    Negar
                                </v-btn>
                            </v-flex>
                            <v-flex
                            v-else-if="item.status == 'approved'"
                            d-flex
                            xs12
                            sm4
                            >
                                <v-btn
                                :loading="loading"
                                :disabled="loading"
                                color="red"
                                class="white--text"
                                ripple
                                raised
                                @click="callAction('forfeit')"
                                >
                                    Remover
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-actions>
            </template>
        </BaseCard>
        <v-dialog v-model="dialog" :persistant="loading" max-width="450">
            <v-card>
                <v-container>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        {{ capitalize(dialogText) }}
                        {{ item.first_name }}?
                    </v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        {{ capitalize(genderNoun) }} receberá uma notificação
                        sobre isso!
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
                        @click="execAction()"
                        >
                            {{ dialogText }}
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
            dialogText: null,
            action: null,
            loading: false,
            copyText: 'copiar'
        }
    },
    computed: {
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
                approved: 'Aprovad' + this.genderLetter,
                pending: 'Pendente',
                denied: 'Negad' + this.genderLetter
            }
            return map[this.item.status]
        },
        genderNoun() {
            let map = {
                male: 'ele',
                female: 'ela',
                na: 'elx',
                other: 'elx'
            }
            return map[this.item.profile.gender]
        },
        genderLetter() {
            let map = {
                male: 'o',
                female: 'a',
                na: 'x',
                other: 'x'
            }
            return map[this.item.profile.gender]
        },
        genderIcon() {
            let map = {
                male: 'fas fa-mars',
                female: 'fas fa-venus',
                na: 'fas fa-rainbow',
                other: 'fas fa-rainbow'
            }
            return map[this.item.profile.gender]
        },
        age() {
            return this.$moment().diff(
                this.item.profile.birthday,
                'years',
                false
            )
        }
    },
    methods: {
        callAction(action) {
            let textMap = {
                approve: 'aprovar',
                deny: 'negar',
                forfeit: 'remover'
            }
            this.dialogText = textMap[action]
            this.action = action
            this.dialog = true
        },
        async execAction() {
            this.loading = true
            let endpoint = this.item.url
            let payload = {
                method: 'patch',
                url: endpoint,
                data: {
                    action: this.action
                }
            }
            try {
                await this.$auth.request(payload)
                this.$ga.event('driver', this.action)
                this.$emit('modified')
            } catch (err) {}
            this.loading = false
            this.dialog = false
        },
        capitalize(text) {
            if (!text) return
            return text.replace(/^\w/, c => c.toUpperCase())
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
            this.$copyText(this.formatPhone(this.item.profile.phone))
            this.copyText = 'copiado!'
        }
    }
}
</script>
