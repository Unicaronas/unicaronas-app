<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-layout row wrap>
                <v-flex d-flex xs12>
                    <h1 class="display-1 font-weight-thin mb-3 text-xs-center">Te enviando para o Unicaronas...</h1>
                </v-flex>
                <v-flex d-flex xs12>
                    <v-progress-circular :size="70" :width="7" color="blue" indeterminate />
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    head() {
        return {
            title: 'Fazendo login - ' + process.env.APP_NAME
        }
    },
    mounted() {
        this.$auth.login()
    }
}
</script>
