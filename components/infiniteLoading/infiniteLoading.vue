<template>
    <v-container v-if="loading" fluid fill-height>
        <v-layout align-center justify-center>
            <v-layout row wrap>
                <v-flex d-flex xs12 mt-5>
                    <v-progress-circular
                    :size="70"
                    :width="7"
                    color="blue"
                    indeterminate
                    />
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    props: {
        trigger: {
            type: Number,
            default: () => 500
        },
        reset: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {
            end: false,
            loading: false,
            finished: true
        }
    },
    watch: {
        reset(n, o) {
            if (n) {
                this.end = false
                this.loading = false
                this.finished = true
            }
        }
    },
    mounted() {
        let state = {
            loaded: () => {
                this.finished = true
                this.loading = false
            },
            complete: () => {
                this.end = true
                this.loading = false
            }
        }
        window.onscroll = ev => {
            if (
                window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - this.trigger &&
                !this.end &&
                this.finished
            ) {
                this.finished = false
                this.loading = true
                this.$emit('infinite', state)
            }
        }
    }
}
</script>
