<template>
    <v-speed-dial
    v-model="fab"
    dark
    fixed
    bottom
    right
    fab
    open-on-hover
    direction="top"
    transition="scale-transition"
    >
        <v-btn slot="activator" v-model="fab" color="blue darken-2" dark fab >
            <v-icon>account_circle</v-icon>
            <v-icon>close</v-icon>
        </v-btn>
        <nuxt-link v-for="tab in tabs" :key="tab" :to="tab.link">
            <v-tooltip left>
                <v-btn
                slot="activator"
                :color="tab.color"
                fab
                small
                dark
                icon
                ripple>
                    <v-icon>{{ tab.icon }}</v-icon>
                </v-btn>

                <span>{{ tab.text }}</span>
            </v-tooltip>
        </nuxt-link>
    </v-speed-dial>
</template>

<script>
export default {
    data: () => ({
        fab: false,
        tabs: [
            {
                text: 'aaa',
                icon: 'account_circle',
                color: 'blue',
                link: '/inspire'
            },
            {
                text: 'bbb',
                icon: 'edit',
                color: 'red',
                link: '/'
            }
        ]
    }),

    computed: {
        activeFab() {
            switch (this.tabs) {
                case 'one':
                    return { class: 'purple', icon: 'account_circle' }
                case 'two':
                    return { class: 'red', icon: 'edit' }
                case 'three':
                    return { class: 'green', icon: 'keyboard_arrow_up' }
                default:
                    return {}
            }
        }
    },

    watch: {
        top(val) {
            this.bottom = !val
        },
        right(val) {
            this.left = !val
        },
        bottom(val) {
            this.top = !val
        },
        left(val) {
            this.right = !val
        }
    }
}
</script>

<style scoped>
a {
    text-decoration: none;
}
</style>
