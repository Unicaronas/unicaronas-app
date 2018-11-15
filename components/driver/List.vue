<template>
    <v-container fluid grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
                <ListItem
                v-for="(item, i) in items"
                :key="i"
                :item="item"
                @deleteItem="$emit('deleteItem', $event)"/>
            </v-flex>
        </v-layout>
        <infinite-loading :reset="resetInfinite" @infinite="$emit('loadMore', $event)"/>
    </v-container>
</template>

<script>
import ListItem from './ListItem.vue'
import infiniteLoading from '~/components/infiniteLoading/infiniteLoading.vue'

export default {
    components: { ListItem, infiniteLoading },
    props: {
        items: {
            type: Array,
            required: true
        },
        resetInfinite: {
            type: Boolean,
            default: () => false
        }
    },
    data() {
        return {}
    }
}
</script>
