const fs = require('fs')
const co = require('co')
const path = require('path')
const mkdirp = require('mkdirp')
const {exec} = require('child_process')

const {paths, assets} = require('../config')
const {appSettings} = require('../appSettings')
const vaultManager = require('./VaultManager')

let FileSystemTools = function(){}

FileSystemTools.prototype.baseJarExists = function(){
    return new Promise((resolve,reject) => {
        let jarLocation = `${paths.assets}/${assets.baseJarName}`
        fs.stat(path.resolve(jarLocation), (err, stats) => {
            if(err) reject(new Error(err))
            resolve(jarLocation)
        })
    })
}

FileSystemTools.prototype.createEnvironmentDirectory = function(environment){
    return new Promise((resolve,reject) => {
        let targetPath = `${appSettings.environmentBuildDirectory}/${environment}`
        mkdirp(targetPath, err => {
            if(err) reject(new Error(err))
            resolve(targetPath)
        })
    })
}

FileSystemTools.prototype.copyToLocation = function(sourceFile, targetFile){
    return  new Promise((resolve, reject) => {

        // this needs to be refactored. I thought it was catching any errors correctly but I'm still getting
        // an uncaught exception error. Maybe the error is here, maybe it's somewhere else. Either way
        // it's 12:21 and I'm ready to go to B E D! Fix it tomorrow!
        try{
            let readStream = fs.createReadStream(sourceFile)
            let writeStream = fs.createWriteStream(targetFile)

            writeStream.on('close', () => {
                resolve(true)
            })

            readStream.pipe(writeStream)

        } catch(exception) {
            reject(new Error(exception))
        }
    })
}

FileSystemTools.prototype.directoryContainsRequiredAEMFiles = function(directory){
    return new Promise((resolve,reject) => {
        const filesInDirectory = fs.readdir(directory, (err,files) => {
            if(err) reject(err)

            let valid = files.map(file => {
                return appSettings.requiredAemFilePatterns.some(regex => new RegExp(regex).test(file))
            }).every(matchFound => matchFound === true)
            resolve(valid)
        })
    })
}

FileSystemTools.prototype.openJarFile = function(path){
    return new Promise((resolve,reject) => {
        exec(`open ${path}`, (error, stdout, stderror) => {
            if(error) reject(error)
            if(stderror) reject(stderror)
            resolve(stdout)
        })
    })
}

FileSystemTools.prototype.killProcess = function(id){
    return new Promise((resolve, reject) => {
        exec(`kill -9 ${id}`, (err, stdout, stderr) => {
            if(err) reject(err)
            if(stderr) reject(stderr)
            resolve(`AEM process ${id} killed.`);
        })
    })
}

FileSystemTools.prototype.pushToAEM = function(credentials, port){
    return new Promise((resolve, reject) => {

        let command = `vlt ${credentials} import http://localhost:${port}/crx ./ /`
        exec(command, (err, stdout, stderr) => {
            if(err) reject(err)
            // if(stderr) reject(stderr)
            resolve(stdout)
        })
    })
}

FileSystemTools.prototype.destroyEnvironment = function (environment){
    return new Promise((resolve, reject) => {
        let targetPath = `${appSettings.environmentBuildDirectory}/${environment}`
        exec(`rm -Rf ${targetPath}`, (err, stdout, stderr) => {
            if(err) reject(new Error(err))
            if(stderr) reject(new Error(stderr))

            resolve(`The ${environment} has been destroyed.`)
        })
    })
}

FileSystemTools.prototype.checkToSeeIfJavaRuntimeEnvIsAvailable = function (){
    return new Promise((resolve, reject) => {
        exec('java -version', (error, stdout, stderr) => {
            if(error) reject(error)

            // Note that we could (and maybe later will) test to make sure we
            // have the minimal usable version of the JRE needed to run AEM, but
            // for now we just want to make sure it's there period.
            if(!/java\sversion/.test(stderr)){
               reject('Unable to determine java runtime environment version.')
            }
            // note that `java -version` returns the version message
            // via standard error instead of standard out. Go figure ;P
            resolve(stderr)
        })
    })
}

FileSystemTools.prototype.extractVltCliTool = function (binInstallPath){
    return new Promise((resolve, reject) => {
        co(function *(){
            let vaultZipPath = yield vaultManager.extractVaultZip()
            let vaultBinaryLocation = yield vaultManager.installVaultTools(vaultZipPath)
            yield vaultManager.createSymLinkForVlt(vaultBinaryLocation)
            yield vaultManager.destroyVaultZip(vaultZipPath)
            resolve(true)
        }).catch(error => {
            resolve(error)
        })
    })
}

FileSystemTools.prototype.checkToSeeIfVltIsInPath = function (){
    return new Promise((resolve, reject) => {
        exec(`which vlt`, (error, stdout, stderr) => {
            if(error) reject(new Error(error))
            if(stderr) reject(new Error(stderr))

            // if stdout then return true?
            resolve(stdout)
        })
    })
}


exports.FileSystemTools = FileSystemTools
