const path = require('path')
const fs = require('fs')

/*=====================
| Environment settings
 =====================*/

const appPaths = {
    environmentBuildDirectory: path.resolve(__dirname, '../AEMEnvironments')
}

const availableEnvironments = ['author', 'publish']

function isAValidEnvironment(env){
    return availableEnvironments.includes(env)
}

/*=====================
| AEM Settings
 =====================*/
// The double backslash seems goofy when defining this regex, but remember that when we define it here
// we're defining it _as a string_ to be turned into a regular expression later via `new RegExp`, so back
// slash does what it does for a string (i.e. strike the next char) instead of what it does within a regular expression.
const jarPattern = `aem-(${availableEnvironments.join('|')})-[\\d]+.jar`
const requiredAemFilePatterns  = [jarPattern,'license\.properties']

//======================
//
module.exports = {
    appPaths,
    isAValidEnvironment,
    requiredAemFilePatterns
}