<template>
    <v-card color="rgba(0, 0, 0, 0)" flat >
        <v-stepper v-model="step" class="hidden-md-and-down">
            <v-stepper-header>
                <template v-for="(s, i) in steps">
                    <v-stepper-step :complete="step > i" :key="`${i}-step`" :step="i" >
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
                        v-validate="'required|max:500'"
                        v-model="origin"
                        :error-messages="errors.collect('origin')"
                        data-vv-as="Origem"
                        data-vv-name="origin"
                        label="De onde você vai sair?"/>
                        <AutocompleteInput
                        v-validate="'required|max:500'"
                        v-model="destination"
                        :error-messages="errors.collect('destination')"
                        data-vv-as="Destino"
                        data-vv-name="destination"
                        label="Para onde você vai?"/>
                        <v-layout row wrap>
                            <v-flex d-flex xs12 sm6>
                                <v-menu
                                :close-on-content-click="false"
                                v-model="dateMenu"
                                :nudge-right="40"
                                lazy
                                transition="slide-y-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                                >
                                    <v-text-field
                                    v-validate="'required|date_format:DD/MM/YYYY'"
                                    ref="date"
                                    slot="activator"
                                    v-model="computeddate"
                                    :error-messages="errors.collect('date')"
                                    data-vv-as="Data"
                                    data-vv-name="date"
                                    label="Data"
                                    prepend-icon="event"
                                    readonly
                                    required/>
                                    <v-date-picker
                                    :min="new Date().toISOString().substr(0, 10)"
                                    v-model="date"
                                    locale="pt-br"
                                    @input="dateMenu = false"/>
                                </v-menu>
                            </v-flex>
                            <v-flex d-flex xs12 sm6>
                                <v-menu
                                ref="timeMenu"
                                :close-on-content-click="false"
                                v-model="timeMenu"
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
                                    v-validate="'required'"
                                    slot="activator"
                                    v-model="time"
                                    :error-messages="errors.collect('time')"
                                    data-vv-as="Hora"
                                    data-vv-name="time"
                                    label="Hora"
                                    prepend-icon="access_time"
                                    readonly
                                    required/>
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
                            v-validate="'required|min_value:0|numeric|max_value:32767'"
                            v-model="price"
                            :error-messages="errors.collect('price')"
                            type="number"
                            data-vv-as="Preço"
                            data-vv-name="price"
                            label="Preço"
                            required/>
                        </v-flex>
                        <v-flex d-flex xs12 offset-sm1 sm6>
                            <v-text-field
                            v-validate="'required|min_value:1|max_value:10|numeric'"
                            v-model="max_seats"
                            :error-messages="errors.collect('max_seats')"
                            type="number"
                            data-vv-as="Lugares"
                            data-vv-name="max_seats"
                            label="Numero de lugares"
                            required/>
                        </v-flex>
                    </v-layout>
                    <v-flex xs12>
                        <v-textarea
                        v-validate="'max:500'"
                        v-model="details"
                        :error-messages="errors.collect('details')"
                        data-vv-as="Detalhes"
                        data-vv-name="details"
                        name="input-7-1"
                        label="Detalhes da carona"
                        placeholder="Explique de onde você vai sair, pra onde vai e quaisquer outros detalhes que seus passageiros devam saber."
                        hint="Não precisa colocar informações de contato. Seus passageiros receberão seu número de celular e você receberá o deles!"/>
                    </v-flex>
                </v-card-text>
            </v-window-item>

            <v-window-item :value="3">
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex d-flex xs12>
                            <v-radio-group
                            v-validate="'required'"
                            v-model="auto_approve"
                            :error-messages="errors.collect('auto_approve')"
                            data-vv-as="Reservas"
                            data-vv-name="auto_approve"
                            required>
                                <div slot="label" class="headline">Aprovar reservas automaticamente?</div>
                                <v-radio :value="true">
                                    <div slot="label">Sim, aceito qualquer um!</div>
                                </v-radio>
                                <v-radio :value="false">
                                    <div slot="label">Não, quero escolher quem vai na carona</div>
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
                            <div slot="label" class="headline">Tudo pronto?</div>
                        </v-flex>
                        <v-flex
                        d-flex
                        xs12
                        md6
                        xl4
                        offset-xl4
                        offset-md3
                        mt-3>
                            <v-btn
                            :loading="submitting"
                            :disabled="submitting"
                            color="secondary"
                            large
                            round
                            raised
                            @click="submit()">
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
                            <div slot="label" class="headline">Carona criada!</div>
                        </v-flex>
                        <v-flex
                        d-flex
                        xs12
                        md6
                        xl4
                        offset-xl4
                        offset-md3
                        mt-3>
                            <v-btn
                            color="secondary"
                            large
                            round
                            raised
                            to="/trips/driver"
                            nuxt>
                                Veja suas caronas!
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-window-item>
        </v-window>

        <v-divider v-if="step < 5"/>

        <v-card-actions v-if="step < 5">
            <v-btn
            v-if="step !== 1"
            flat
            @click="step--"
            >
                Voltar
            </v-btn>
            <v-spacer/>
            <v-btn
            v-if="step < 4"
            color="primary"
            @click="nextStep()"
            >
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
        }
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
        }
    }
}
</script>
