const path = require('path')

// The double backslash seems goofy when defining this regex, but remember that when we define it here
// we're defining it _as a string_ to be turned into a regular expression later via `new RegExp`, so back
// slash does what it does for a string (i.e. strike the next char) instead of what it does within a regular expression.

const appSettings = {
    maxBuffer: {maxBuffer: 1024 * 500},
    environmentBuildDirectory: path.resolve(__dirname, '../AEMEnvironments'),
    maxBufferValue: {maxBuffer: 1024 * 500},
    availableEnvironments: ['author', 'publish'],
}

appSettings.requiredAemFilePatterns = [
    `aem-(${appSettings.availableEnvironments.join('|')})-[\\d]+.jar`,
    'license\.properties'
]

const isAValidEnvironment = function (env){
    return appSettings.availableEnvironments.includes(env)
}

module.exports = {appSettings, isAValidEnvironment}
