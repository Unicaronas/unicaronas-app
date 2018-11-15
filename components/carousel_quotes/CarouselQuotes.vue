<template>
    <v-carousel
    :dark="$store.state.theme.appColor == 'dark'"
    :light="$store.state.theme.appColor == 'light'"
    height="20em"
    hide-delimiters>
        <CarouselQuoteItem
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :content="item.content"
        :author="item.author"/>
    </v-carousel>
</template>

<script>
import CarouselQuoteItem from './CarouselQuoteItem.vue'

export default {
    components: { CarouselQuoteItem },
    props: {
        items: {
            type: Array,
            required: true
        }
    }
}
</script>

<style>
.v-carousel {
    box-shadow: none;
}
.v-carousel__item .v-responsive__content {
    margin: auto;
}
</style>
