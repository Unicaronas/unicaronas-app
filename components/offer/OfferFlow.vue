<template>
    <v-card color="rgba(0, 0, 0, 0)" flat>
        <v-stepper v-model="step" class="hidden-md-and-down">
            <v-stepper-header>
                <template v-for="(s, i) in steps">
                    <v-stepper-step
                    :key="`${i}-step`"
                    :complete="step > i"
                    :step="i"
                    >
                        {{ step >= i ? s.title : '' }}
                    </v-stepper-step>
                </template>
            </v-stepper-header>
        </v-stepper>
        <v-card-title class="display-1 font-weight-thin text-xs-center">
            <span>{{ currentTitle }}</span>
        </v-card-title>

        <v-window v-model="step">
            <v-window-item :value="1">
                <v-card-text>
                    <form>
                        <AutocompleteInput
                        v-model="origin"
                        v-validate="'required|max:500'"
                        :error-messages="errors.collect('origin')"
                        data-vv-as="Origem"
                        data-vv-name="origin"
                        label="De onde você vai sair?"
                        />
                        <AutocompleteInput
                        v-model="destination"
                        v-validate="'required|max:500'"
                        :error-messages="errors.collect('destination')"
                        data-vv-as="Destino"
                        data-vv-name="destination"
                        label="Para onde você vai?"
                        />
                        <v-layout row wrap>
                            <v-flex d-flex xs12 sm6>
                                <v-menu
                                v-model="dateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                lazy
                                transition="slide-y-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                                >
                                    <v-text-field
                                    ref="date"
                                    slot="activator"
                                    v-model="computeddate"
                                    v-validate="
                                        'required|date_format:dd/MM/yyyy'
                                    "
                                    :error-messages="errors.collect('date')"
                                    data-vv-as="Data"
                                    data-vv-name="date"
                                    label="Data"
                                    prepend-icon="event"
                                    readonly
                                    required
                                    />
                                    <v-date-picker
                                    v-model="date"
                                    :min="
                                        new Date()
                                            .toISOString()
                                            .substr(0, 10)
                                    "
                                    locale="pt-br"
                                    @input="dateMenu = false"
                                    />
                                </v-menu>
                            </v-flex>
                            <v-flex d-flex xs12 sm6>
                                <v-menu
                                ref="timeMenu"
                                v-model="timeMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="time"
                                lazy
                                transition="slide-y-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                                >
                                    <v-text-field
                                    slot="activator"
                                    v-model="time"
                                    v-validate="'required'"
                                    :error-messages="errors.collect('time')"
                                    data-vv-as="Hora"
                                    data-vv-name="time"
                                    label="Hora"
                                    prepend-icon="access_time"
                                    readonly
                                    required
                                    />
                                    <v-time-picker
                                    v-if="timeMenu"
                                    v-model="time"
                                    format="24hr"
                                    full-width
                                    @change="$refs.timeMenu.save(time)"
                                    />
                                </v-menu>
                            </v-flex>
                        </v-layout>
                    </form>
                </v-card-text>
            </v-window-item>

            <v-window-item :value="2">
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex d-flex xs12 sm5>
                            <v-text-field
                            v-model="price"
                            v-validate="
                                'required|min_value:0|numeric|max_value:32767'
                            "
                            :error-messages="errors.collect('price')"
                            type="number"
                            data-vv-as="Preço"
                            data-vv-name="price"
                            label="Preço"
                            required
                            />
                        </v-flex>
                        <v-flex d-flex xs12 offset-sm1 sm6>
                            <v-text-field
                            v-model="max_seats"
                            v-validate="
                                'required|min_value:1|max_value:10|numeric'
                            "
                            :error-messages="errors.collect('max_seats')"
                            type="number"
                            data-vv-as="Lugares"
                            data-vv-name="max_seats"
                            label="Numero de lugares"
                            required
                            />
                        </v-flex>
                    </v-layout>
                    <v-flex xs12>
                        <v-textarea
                        v-model="details"
                        v-validate="'max:500'"
                        :error-messages="errors.collect('details')"
                        data-vv-as="Detalhes"
                        data-vv-name="details"
                        name="input-7-1"
                        label="Detalhes da carona"
                        placeholder="Explique de onde você vai sair, pra onde vai e quaisquer outros detalhes que seus passageiros devam saber."
                        hint="Não precisa colocar informações de contato. Seus passageiros receberão seu número de celular e você receberá o deles!"
                        />
                    </v-flex>
                </v-card-text>
            </v-window-item>

            <v-window-item :value="3">
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex d-flex xs12>
                            <v-radio-group
                            v-model="auto_approve"
                            v-validate="'required'"
                            :error-messages="errors.collect('auto_approve')"
                            data-vv-as="Reservas"
                            data-vv-name="auto_approve"
                            required
                            >
                                <div slot="label" class="headline">
                                    Aprovar reservas automaticamente?
                                </div>
                                <v-radio :value="true">
                                    <div slot="label">
                                        Sim, aceito qualquer um!
                                    </div>
                                </v-radio>
                                <v-radio :value="false">
                                    <div slot="label">
                                        Não, quero escolher quem vai na carona
                                    </div>
                                </v-radio>
                            </v-radio-group>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-window-item>
            <v-window-item :value="4">
                <v-card-text>
                    <v-layout row wrap class=" text-xs-center">
                        <v-flex d-flex xs12>
                            <div slot="label" class="headline">
                                Tudo pronto?
                            </div>
                        </v-flex>
                        <v-flex
                        d-flex
                        xs12
                        md6
                        xl4
                        offset-xl4
                        offset-md3
                        mt-3
                        >
                            <v-btn
                            :loading="submitting"
                            :disabled="submitting"
                            color="secondary"
                            large
                            round
                            raised
                            @click="submit()"
                            >
                                Criar carona!
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-window-item>
            <v-window-item :value="5">
                <v-card-text>
                    <v-layout row wrap class=" text-xs-center">
                        <v-flex d-flex xs12>
                            <div class="headline font-weight-thin">
                                Compartilhe sua carona!
                            </div>
                        </v-flex>
                        <v-flex d-flex md8 offset-md2>
                            <div class="subheading mt-2">
                                Copie o texto abaixo e compartilhe nos seus
                                grupos de carona para preencher as vagas mais
                                rápido:
                            </div>
                        </v-flex>
                        <v-flex d-flex md8 offset-md2>
                            <v-card class="mt-3">
                                <v-card-text>
                                    <div style="white-space: pre-line;" class="body-2">
                                        {{ shareMessage }}
                                    </div>
                                    <a :href="shareUrl" target="_blank">{{
                                        shareUrl
                                    }}</a>
                                </v-card-text>
                                <v-card-actions class="justify-center">
                                    <v-tooltip
                                    v-model="copied"
                                    :disabled="!copied"
                                    top
                                    >
                                        <v-btn
                                        slot="activator"
                                        flat
                                        color="primary"
                                        @click="share()"
                                        >
                                            <v-icon left>
                                                share
                                            </v-icon>
                                            Clique para
                                            {{
                                                canShare
                                                    ? 'compartilhar'
                                                    : 'copiar'
                                            }}
                                        </v-btn>
                                        <span>Texto copiado!</span>
                                    </v-tooltip>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                        <v-flex
                        d-flex
                        xs12
                        md6
                        xl4
                        offset-xl4
                        offset-md3
                        mt-3
                        >
                            <v-btn
                            color="secondary"
                            large
                            round
                            raised
                            to="/trips/driver"
                            nuxt
                            >
                                Veja suas caronas!
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-window-item>
        </v-window>

        <v-divider v-if="step < 5" />

        <v-card-actions v-if="step < 5">
            <v-btn v-if="step !== 1" flat @click="step--">
                Voltar
            </v-btn>
            <v-spacer />
            <v-btn v-if="step < 4" color="primary" @click="nextStep()">
                Próximo
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import AutocompleteInput from '~/components/misc/AutocompleteInput.vue'

export default {
    components: { AutocompleteInput },
    props: {
        value: {
            type: Object,
            required: true
        },
        submitted: {
            type: Boolean,
            required: true
        },
        reset: {
            type: Boolean,
            required: true
        },
        createdTrip: {
            type: Object,
            required: false,
            default: null
        }
    },
    data: () => ({
        step: 1,
        submitting: false,

        origin: '',
        destination: '',
        price: 20,
        date: null,
        dateMenu: false,
        time: null,
        timeMenu: false,
        max_seats: 3,
        details: '',
        auto_approve: true,

        steps: {
            1: {
                title: 'Local e Data',
                fields: ['origin', 'destination', 'date', 'time']
            },
            2: {
                title: 'Detalhes',
                fields: ['price', 'max_seats', 'details']
            },
            3: {
                title: 'Aprovação',
                fields: ['auto_approve']
            },
            4: {
                title: 'Confirmar',
                fields: []
            },
            5: {
                title: 'Pronto!',
                fields: []
            }
        },
        copied: false
    }),
    computed: {
        currentTitle() {
            return this.steps[this.step].title
        },
        computeddate() {
            return this.formatDate(this.date)
        },
        nSteps() {
            return Object.keys(this.steps).length
        },
        formData() {
            let formData = {}
            Object.entries(this.steps)
                .filter(step => {
                    return step[0] <= this.step
                })
                .forEach(step => {
                    step[1].fields.forEach(field => {
                        formData[field] = this[field]
                    })
                })
            return formData
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
        },
        shareMessage() {
            if (!this.createdTrip) return ''
            return ('[OFEREÇO]\n' +
                this.originCity +
                ' >> ' +
                this.destinationCity +
                ' \n' +
                this.$moment(this.createdTrip.datetime).calendar() +
                ' por R$' +
                this.createdTrip.price +
                ' \nPelo Unicaronas'
            )
        },
        shareUrl() {
            if (!this.createdTrip) return ''
            return (
                location.protocol +
                '//' +
                location.host +
                '/search/' +
                this.createdTrip.id
            )
        },
        canShare() {
            return Boolean(navigator.share)
        }
    },
    watch: {
        submitted(n, o) {
            if (n) this.step = 5
        },
        reset(n, o) {
            if (n) {
                this.submitting = false
                this.step = 1
            }
        }
    },
    methods: {
        formatDate(date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        nextStep() {
            let fields = this.steps[this.step].fields
            this.$validator.validateAll(fields).then(result => {
                if (result) this.nextStepCallback()
            })
        },
        nextStepCallback() {
            // Check if step function exists
            this.$emit('input', this.formData)
            if (typeof this['getStep_' + this.step] === 'function') {
                return this['getStep_' + this.step]()
            } else {
                this.step++
            }
        },
        submit() {
            this.submitting = true
            this.$emit('submit')
            this.$ga.event('trips', 'create')
            this.$fb.track('Create')
        },
        getAddrComp(source, component, short) {
            // Get the address component from the trip
            if (!this.createdTrip) return ''
            return this.createdTrip[source].filter(comp =>
                comp.types.includes(component)
            )[0][short]
        },
        share() {
            if (this.canShare) {
                navigator
                    .share({
                        text: this.shareMessage,
                        url: '/search/' + this.createdTrip.id
                    })
                    .then(() => {})
                    .catch(error => {})
            } else {
                this.$copyText(
                    this.shareMessage +
                        ' \n' +
                        location.protocol +
                        '//' +
                        location.host +
                        '/search/' +
                        this.createdTrip.id
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
