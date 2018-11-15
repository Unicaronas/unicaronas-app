const path = require('path')

const defaults = {
    locales: [],
    plugin: true
}

module.exports = function momentModule(moduleOptions) {
    if (Array.isArray(moduleOptions)) {
        moduleOptions = {
            locales: moduleOptions
        }
    }

    const options = Object.assign(
        {},
        defaults,
        moduleOptions,
        this.options.moment
    )

    if (options.plugin) {
        this.addPlugin({
            src: path.resolve(__dirname, 'moment.plugin.js'),
            fileName: 'moment.js',
            options
        })
    }
}
