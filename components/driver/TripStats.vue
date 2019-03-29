<template>
    <v-container>
        <v-layout row wrap>
            <v-flex d-flex xs12>
                <h1 class="display-1 font-weight-thin">
                    {{ counter() }} {{ pluralize('carona') }}
                    {{ pluralize('encontrada') }}
                </h1>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    props: {
        count: {
            type: Number,
            required: true
        }
    },
    methods: {
        counter() {
            return this.count == 0 ? 'Nenhuma' : this.count
        },
        pluralize(text) {
            return this.count <= 1 ? text : text + 's'
        }
    }
}
</script>
