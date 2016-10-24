const path = require('path')

const paths = {
    assets: path.resolve(__dirname, 'assets'),
    bin: '/Users/cschmitz/Desktop/testdir'
    // bin: '/usr/local/bin'
}
paths.extractionPath = `${path.resolve(paths.assets, 'extractWorkspace')}`


const assets = {
    baseJarName: 'aem-environment-port.jar',
    licenseFileName: 'license.properties',
}

module.exports = {paths, assets}
