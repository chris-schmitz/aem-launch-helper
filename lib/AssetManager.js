// Not sure if I love this name, but this is what we're going with at the moment.

const config = require('../config')
const {exec} = require('child_process')
const path = require('path')

/*
    Note that _all_ functions in this file center around managing the
    /assets/ folder. We're not trying to go out of our way to be flexible in
    file outside of whatever path is specified in the config.js file.
*/

function extractVaultZip(){
    return new Promise((resolve, reject) => {
        let jarPath = `${path.resolve(config.paths.assets, config.assets.baseJarName)}`
        let extractionPath = `${path.resolve(config.paths.assets, 'extractWorkspace')}`
        exec(`unzip ${jarPath} "static/opt/filevault/filevault.zip" -d ${extractionPath}`, (error,stdout,stderr) => {
            // once the files are extracted return their path
        })
    })
}


/*
co(function *(){
    let vaultZipPath = yield assetManager.extractVaultZip()
    let vaultInstallPath = yield assetManager.installVaultTools(vaultZipPath)
    yield assetManager.createSymLinkForVlt(vaultInstallPath)
    yield assetManager.destroyVaultZip(vaultZipPath)
    resolve(true)
}).catch(error => {
    resolve(error)
})
// unzip the dir containing the filevalut.zip from within the jar to the asset dir:
//  unzip aem-environment-port.jar "static/opt/filevault/filevault.zip"

// unzip the filevalut zip to the binInstallPath
//  unzip filevalut.zip -d binInstallPath

// create a symbolic link from filevault.zip's extraction to the bin path
//  ln -s binInstallPath/filevaultextract/bin/vlt binInstallPath/vlt
// don't forget that the extracted filevault folder will have a version number in it

// destroy the unzipped folder in assets with the filevault zip in it
// rm -rf static
*/
