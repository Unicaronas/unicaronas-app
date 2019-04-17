<template>
    <v-container>
        <v-layout row wrap>
            <v-flex d-flex xs12 mt-5 offset-lg2>
                <h1 class="display-2 font-weight-thin">
                    Oferecer uma carona
                </h1>
            </v-flex>
            <v-flex d-flex xs12 lg8 mt-5 offset-lg2>
                <v-alert v-model="error" dismissible type="error">
                    {{ errorMessage }}
                </v-alert>
            </v-flex>
            <LoadingPermissions v-if="!isMounted" />
            <template v-else-if="!hasScope">
                <v-flex d-flex xs12 md8 mt-5 offset-md2>
                    <v-alert value="true" type="error">
                        <b>Algumas permissões estão faltando</b>. Por favor,
                        refaça o login e aceite pelo menos a permissão de
                        criação de caronas.
                    </v-alert>
                </v-flex>
                <v-flex
                d-flex
                xs12
                mb-5
                md2
                mt-3
                offset-md5
                >
                    <v-btn round color="primary" ripple @click="$auth.login()">
                        Refazer login
                    </v-btn>
                </v-flex>
            </template>
            <template v-else-if="!$auth.user.driver">
                <v-flex d-flex xs12 md8 mt-5 offset-md2>
                    <v-alert value="true" type="error">
                        <b>Você não é motorista!</b> Para criar caronas, você
                        precisa preencher seus dados como motorista.
                    </v-alert>
                </v-flex>
                <v-flex
                d-flex
                xs12
                mb-5
                md2
                mt-3
                offset-md5
                >
                    <v-btn
                    :href="SERVER_URL + '/accounts/profile/edit/'"
                    round
                    color="primary"
                    ripple
                    >
                        Editar perfil
                    </v-btn>
                </v-flex>
            </template>
            <template v-else>
                <v-flex
                d-flex
                xs12
                mb-5
                mt-3
                offset-lg2
                lg5
                md6
                >
                    <OfferFlow
                    v-model="formData"
                    :submitted="submitted"
                    :reset="resetForm"
                    :created-trip="createdTrip"
                    @submit="handleSubmit"
                    />
                </v-flex>
                <v-flex hidden-md-and-down d-flex offset-md1 lg4 md5>
                    <OfferSummary :form-data="formData" />
                </v-flex>
            </template>
        </v-layout>
    </v-container>
</template>

<script>
import OfferFlow from '~/components/offer/OfferFlow.vue'
import OfferSummary from '~/components/offer/Summary.vue'
import LoadingPermissions from '~/components/misc/LoadingPermissions.vue'

export default {
    components: { OfferFlow, OfferSummary, LoadingPermissions },
    data() {
        return {
            isMounted: false,
            hasScope: false,
            submitted: false,
            resetForm: false,
            createdTrip: null,

            formData: {},

            error: false,
            errorMessage: '',
            SERVER_URL: process.env.SERVER_URL
        }
    },
    head() {
        return {
            title: 'Oferecer - ' + process.env.APP_NAME
        }
    },
    mounted() {
        this.isMounted = true
        this.hasScope =
            this.$auth.hasScope('alarms:read') &&
            this.$auth.hasScope('alarms:write')
    },
    methods: {
        async handleSubmit() {
            let API_URL =
                process.env.SERVER_URL + '/api/' + process.env.API_VERSION
            let url = API_URL + '/trips/driver/'
            let data = {
                origin: this.formData.origin,
                destination: this.formData.destination,
                price: this.formData.price,
                auto_approve: this.formData.auto_approve,
                max_seats: this.formData.max_seats,
                details: this.formData.details,
                datetime: this.formData.date + 'T' + this.formData.time
            }
            let payload = {
                method: 'post',
                url: url,
                data: data
            }
            try {
                this.createdTrip = await this.$auth.request(payload)
                this.submitted = true
            } catch (err) {
                this.error = true
                this.errorMessage =
                    'Opa! Não deu pra criar sua carona. Tente de novo!'
                this.submitted = false
                this.resetForm = true
                setTimeout(() => (this.resetForm = false), 1000)
            }
        }
    }
}
</script>
