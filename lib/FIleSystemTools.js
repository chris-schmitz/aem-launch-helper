const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const {exec} = require('child_process')

const {paths, assets} = require('../config')
const {appSettings} = require('../appSettings')



function  baseJarExists(){
    return new Promise((resolve,reject) => {
        let jarLocation = `${paths.assets}/${assets.baseJarName}`
        fs.stat(path.resolve(jarLocation), (err, stats) => {
            if(err) reject(new Error(err))
            resolve(jarLocation)
        })
    })
}

function createEnvironmentDirectory(environment){
    return new Promise((resolve,reject) => {
        let targetPath = `${appSettings.environmentBuildDirectory}/${environment}`
        mkdirp(targetPath, err => {
            if(err) reject(new Error(err))
            resolve(targetPath)
        })
    })
}

function copyToLocation(sourceFile, targetFile){
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

function directoryContainsRequiredAEMFiles(directory){
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

function openJarFile(path){
    return new Promise((resolve,reject) => {
        exec(`open ${path}`, (error, stdout, stderror) => {
            if(error) reject(error)
            if(stderror) reject(stderror)
            resolve(stdout)
        })
    })
}

module.exports = {
    baseJarExists,
    createEnvironmentDirectory,
    copyToLocation,
    directoryContainsRequiredAEMFiles,
    openJarFile
}
