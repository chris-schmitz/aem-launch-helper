const path = require('path')

const paths = {
    assets: path.resolve(__dirname, 'assets'),
    bin: '/usr/local/bin'
}
paths.extractionPath = `${path.resolve(paths.assets, 'extractWorkspace')}`


// Todo: consider moving these to `appSettings`. they're not really
// values that need to be changed by the developer.
const assets = {
    baseJarName: 'aem-environment-port.jar',
    licenseFileName: 'license.properties',
}

module.exports = {paths, assets}
