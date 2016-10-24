const config = require('../config')
const {exec} = require('child_process')
const path = require('path')

let VaultManager = {}

VaultManager.extractVaultZip = function (){
    return new Promise((resolve, reject) => {
        let jarPath = `${path.resolve(config.paths.assets, config.assets.baseJarName)}`
        exec(`unzip -od ${config.paths.extractionPath} ${jarPath} "static/opt/filevault/filevault.zip"`, (error,stdout,stderr) => {
            if(error) reject (new Error(error))
            if(stderr) reject (new Error(stderr))

            let path = stdout.match(/inflating:\s([\s\w\d\/\\]+.zip)/)

            if(path.length >= 2){
                resolve(path[1])// the desitnation of the extracted zip file
            }
            reject(new Error('Unable to determine unzip path.'))

        })
    })
}

VaultManager.installVaultTools = function (zipPath){
    return new Promise(function(resolve, reject) {
        let binInstallDestination = config.paths.bin

        exec(`mkdir -p ${binInstallDestination}`, (error, stdout, stderr) => {
            if(error) reject (new Error(error))
            if(stderr) reject (new Error(stderr))

            exec(`unzip -od ${binInstallDestination} ${zipPath}`, (error, stdout, stderr) => {
                if(error) reject (new Error(error))
                if(stderr) reject (new Error(stderr))
                let match = stdout.match(/inflating:\s([\s\w\d/.]+vault-cli-[\d.]+\/bin\/vlt[^.])/)
                if(match.length >= 2){
                    resolve(match[1])
                }
                reject('Unable to determine location of extracted zip.')
            })
        })
    });
}

VaultManager.createSymLinkForVlt = function (vaultBinaryLocation){
    return new Promise(function(resolve, reject) {
        let binInstallDestination = config.paths.bin

        // we're forcing the creation of the link (-f) to make sure the link is recreated even if it already exists
        // note that a successful link does not give a result. We could throw a `-v` flag to force an output, but since
        // we already have access to possible error messages (`error` and `stderr`) and we're already catching for them
        // there's no need to be verbose. No stdout is good.
        exec(`ln -sf ${vaultBinaryLocation} ${binInstallDestination}/vlt`, (error, stdout, stderr) => {
            if(error) reject (new Error(error))
            if(stderr) reject (new Error(stderr))

            resolve('Link created')
        })
    });
}

VaultManager.destroyVaultZip = function (){
    return new Promise(function(resolve, reject) {
        exec(`rm -Rf ${config.paths.extractionPath}/*`, (error, stdout, stderr) => {
            if(error) reject (new Error(error))
            if(stderr) reject (new Error(stderr))
            resolve('Extracted tools destroyed.')
        })
    });
}

module.exports = VaultManager
