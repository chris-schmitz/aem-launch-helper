const path = require('path')

const paths = {
    assets: path.resolve(__dirname, 'assets')
}

const assets = {
    baseJarName: 'aem-environment-port.jar',
    licenseFileName: 'license.properties',
}

module.exports = {paths, assets}
