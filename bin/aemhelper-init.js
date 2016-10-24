#!/usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const co = require('co')
const ProgressBar = require('progress')
const config = require('../config')
const {FileSystemTools} = require('../lib/FileSystemTools')
const fst = new FileSystemTools

// console.log('Setting up AEM environment tools.\n')
// console.log("Special note: these helper tools do not include the AEM .jar or license files. As part of this initilization process you will be asked to provide both files so that this helper tool can copy it into it's assets folder. If you do not have the aem .jar file and the license file handy, please cancel this init process, locate the files, and start it again." )
// console.log()

let askForJarLocation = {
    type:'input',
    name: 'jarPath',
    message: 'Enter the path to your AEM .jar file.'
}

let askForLicense = {
    type:'input',
    name: 'licensePath',
    message: 'Enter the path to your AEM license.'
}


co(function *(){
    let jarPathAnswer = yield inquirer.prompt(askForJarLocation)
    let licensePathAnswer = yield inquirer.prompt(askForLicense)

    let bar = new ProgressBar('Setting up helper tools (step :current of 2): [:bar]', {total: 4})
    bar.tick()


    yield fst.checkToSeeIfJavaRuntimeEnvIsAvailable()
    bar.tick()
    console.log('java installed')
    yield fst.copyToLocation(licensePathAnswer.licensePath, `${config.paths.assets}/${config.assets.licenseFileName}`)
    bar.tick()
    yield fst.copyToLocation(jarPathAnswer.jarPath, `${config.paths.assets}/${config.assets.baseJarName}`)
    bar.tick()
    let vaultBinaryLocation = yield fst.extractVltCliTool()
    bar.tick()
    let inPath = yield fst.checkToSeeIfVltIsInPath()
    bar.tick()

    if(!inPath){
        console.log(chalk.bgCyan(`Add the following to your environment path: ${vaultBinaryLocation}`))
    } else {
        console.log(chalk.green(`The vlt binary has been installed in the following location: ${vaultBinaryLocation}`))
    }

    console.log(chalk.green('\nInitilization complete.'))
}).catch(error => {
    console.log(error)
})
