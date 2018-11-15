<template>
    <v-flex xs12>
        <v-hover>
            <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}` + ' ' + themeClass"
            :dark="themeDark"
            :light="themeLight"
            raised>
                <slot :theme="theme" name="card" />
            </v-card>
        </v-hover>
    </v-flex>
</template>

<script>
export default {
    data() {
        return {
            theme_text: '',
            theme_color: '',
            theme_modifier: ''
        }
    },
    computed: {
        themeDark() {
            let theme = this.$store.state.theme
            if (theme.cardColor == 'dark') {
                return true
            }
            return false
        },
        themeLight() {
            let theme = this.$store.state.theme
            if (theme.cardColor == 'light') {
                return true
            }
            return false
        },
        themeClass() {
            let cls = ''
            let theme = this.$store.state.theme
            if (theme.cardColor == 'random') {
                this.getRandomColor()
                cls =
                    cls +
                    ' ' +
                    this.theme_color +
                    ' ' +
                    this.theme_modifier +
                    ' ' +
                    this.theme_text
            }
            if (this.isDark) cls += ' dark-card'
            else cls += ' light-card'
            return cls
        },
        theme() {
            let isDL = this.themeDark || this.themeLight
            return {
                theme_text: isDL ? '' : this.theme_text,
                theme_modifier: isDL ? '' : this.theme_modifier,
                theme_color: isDL ? '' : this.theme_color,
                theme_dark: this.themeDark,
                theme_light: this.themeLight
            }
        },
        isDark() {
            if (this.themeDark || this.theme.theme_text == 'white--text')
                return true
            return false
        },
        isLight() {
            return !this.isDark
        }
    },
    methods: {
        getRandomColor() {
            let colors = [
                'primary',
                'secondary',
                'blue',
                'green',
                'red',
                'pink',
                'purple',
                'cyan',
                'teal',
                'grey'
            ]
            let modifiers = ['lighten', 'darken']
            let levels = [1, 2, 3, 4]
            let color = colors[Math.floor(Math.random() * colors.length)]
            let modifier =
                modifiers[Math.floor(Math.random() * modifiers.length)]
            let level = levels[Math.floor(Math.random() * levels.length)]
            let text = 'white--text'
            if (modifier == 'lighten') {
                text = 'black--text'
            }
            this.theme_text = text
            this.theme_color = color
            this.theme_modifier = modifier + '-' + level
        }
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
