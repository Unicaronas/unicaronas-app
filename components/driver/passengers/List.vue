<template>
    <v-container fluid grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
                <ListItem
                v-for="(item, i) in items"
                :key="i"
                :item="item"
                @modified="$emit('modified')"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import ListItem from './ListItem.vue'

export default {
    components: { ListItem },
    props: {
        items: {
            type: Array,
            required: true
        }
    }
}
</script>
