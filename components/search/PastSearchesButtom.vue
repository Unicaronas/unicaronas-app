<template>
    <v-btn color="info" round @click="query_click()">
        <v-icon class="mr-2">
            query_builder
        </v-icon>
        {{ compOrigin }}
        <v-icon class="ml-2 mr-2">
            arrow_forward
        </v-icon>
        {{ compDest }}
    </v-btn>
</template>
<script>
export default {
    props: {
        origin: {
            type: String,
            required: true,
            default: ''
        },
        destination: {
            type: String,
            required: true,
            default: ''
        }
    },
    computed: {
        compOrigin() {
            return this.compactAddr(this.origin)
        },
        compDest() {
            return this.compactAddr(this.destination)
        }
    },
    methods: {
        query_click() {
            this.$ga.event('past search', 'click')
            this.$emit('clicked', {
                origin: this.origin,
                destination: this.destination
            })
        },
        trimAddr(addr) {
            return addr.split('-')[0].trim()
        },
        compactAddr(addr) {
            let maxLength = 11
            addr = this.trimAddr(addr)
            if (addr.length > maxLength) {
                addr = addr.slice(0, maxLength - 1).trim() + '...'
            }
            return addr
        }
    }
}
</script>
