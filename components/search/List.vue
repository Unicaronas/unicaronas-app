<template>
    <v-container
    fluid
    grid-list-lg>
        <v-layout row wrap>
            <template v-if="searchType == 'external'" >
                <ListItemBasic
                v-for="(item, i) in items"
                :key="i"
                :item="item" />
            </template>
            <template v-else>
                <ListItem
                v-for="(item, i) in items"
                :key="i"
                :item="item" />
            </template>
        </v-layout>
        <infinite-loading v-if="searchType == 'local'" :reset="resetInfinite" @infinite="loadMore"/>
    </v-container>
</template>

<script>
import ListItem from './ListItem.vue'
import ListItemBasic from './ListItemBasic.vue'
import infiniteLoading from '~/components/infiniteLoading/infiniteLoading.vue'

export default {
    components: { ListItem, ListItemBasic, infiniteLoading },
    props: {
        items: {
            type: Array,
            required: true
        },
        searchType: {
            type: String,
            required: true
        },
        resetInfinite: {
            type: Boolean,
            default: () => false
        }
    },
    methods: {
        loadMore($state) {
            this.$emit('loadMore', $state)
        }
    }
}
</script>
