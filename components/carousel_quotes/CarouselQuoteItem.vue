<template>
    <v-carousel-item>
        <v-card
        :dark="$store.state.theme.appColor == 'dark'"
        :light="$store.state.theme.appColor == 'light'"
        flat
        color="rgba(0, 0, 0, 0)"
        >
            <v-layout row align-center wrap>
                <v-flex xs10 offset-xs1>
                    <v-container>
                        <h5
                        class="title font-weight-light font-italic mb-3 text-xs-center"
                        >
                            "{{ title }}"
                        </h5>
                        <p class="subheading text-xs-center">
                            {{ author }}
                        </p>
                    </v-container>
                </v-flex>
            </v-layout>
        </v-card>
    </v-carousel-item>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        }
    }
}
</script>
