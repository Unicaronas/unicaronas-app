<template>
    <div>
        <span v-html="formattedString"/>
        <template v-if="showReadMore">
            <a v-if="!isReadMore" @click="triggerReadMore(true)">{{ moreStr }}</a>
            <a v-else @click="triggerReadMore(false)">{{ lessStr }}</a>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        moreStr: {
            type: String,
            default: 'ver mais'
        },
        lessStr: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            required: true
        },
        link: {
            type: String,
            default: '#'
        },
        maxChars: {
            type: Number,
            default: 100
        }
    },
    data() {
        return {
            isReadMore: false
        }
    },
    computed: {
        string() {
            return this.text.trim()
        },
        formattedString() {
            var val_container = this.string

            if (!this.isReadMore && val_container.length > this.maxChars) {
                val_container =
                    val_container.substring(0, this.maxChars).trim() + '...'
            }

            // Also limit newlines to 3
            let n_pos = this.getPosition(val_container, '\n', 3)
            if (n_pos != val_container.length - 1 && !this.isReadMore) {
                val_container = val_container.substring(0, n_pos).trim() + '...'
            }

            return `"${val_container}"`
        },
        showReadMore() {
            let n_pos = this.getPosition(this.string, '\n', 3)

            if (this.string.length > this.maxChars) {
                return true
            } else if (n_pos != this.string.length - 1) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        triggerReadMore(show) {
            if (this.lessStr !== null || this.lessStr !== '')
                this.isReadMore = show
        },
        getPosition(string, subString, index) {
            return string.split(subString, index).join(subString).length
        }
    }
}
</script>
<style scoped>
span {
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
}
a {
    text-decoration: underline;
}
</style>
