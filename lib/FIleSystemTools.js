const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const {exec} = require('child_process')

const {paths, assets} = require('../config')
const {appSettings} = require('../appSettings')

let FileSystemTools = function(){}

FileSystemTools.prototype.test = function(){
    return this.name
}

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

module.exports = FileSystemTools
