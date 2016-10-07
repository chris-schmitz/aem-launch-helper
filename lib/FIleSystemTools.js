const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const {exec} = require('child_process')

const {paths, assets} = require('../config')
const {appPaths} = require('../appSettings')



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
        let targetPath = `${appPaths.environmentBuildDirectory}/${environment}`
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

module.exports = {
    baseJarExists,
    createEnvironmentDirectory,
    copyToLocation
}