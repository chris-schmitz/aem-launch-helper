const fs = require('fs')
const path = require('path')
const config = require('../config')

function AssetManager(){}

AssetManager.getLicensePath = function(){
    return path.resolve(config.paths.assets, 'license.properties')
}

AssetManager.licenseIsInstalled = function (){
    return fs.existsSync(this.getLicensePath())
}

module.exports = AssetManager
