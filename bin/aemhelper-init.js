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

// let askForBinaryInstallPath = {
//     type: 'input',
//     name: 'binInstallPath',
//     message: 'As a part of this process the `vlt` command line tool will be installed. What bin directory would you like it installed in?',
//     default: '/usr/local/bin' // not sure if this is the best default to use. Run with it or now.
// }

// I'm leaving this in b/c I may add it back in during a refactor, but at the moment
// I'm cutting it out because part of the xml needed in the `~/.valut/auth.xml`
// file requires the url of the instance including the port to use. We do have
// access to that information when the user uses the `aemhelper create` subtool
// as they specify the port they want to use, but at the moment that subtool is
// meant to run separate and _after_ this subtool has been used.
// In a refactor we could update this init subtool to setup the author and publish
// env as part of the setup, but 1 I don't want to do that right now and 2 I don't
// know that I think that's really a good idea.
// let askForUsername = {
//     type: 'input',
//     name: 'aemUsername',
//     message: 'Enter the username for your AEM instance.',
//     default: 'Admin'
// }
//
// let askForPassword = {
//     type: 'password',
//     name: 'aemPassword',
//     message: 'Enter the password for your AEM instance. (This will encrypted and stored in your `~/.vault/auth.xml`)'
// }



co(function *(){
    let jarPathAnswer = yield inquirer.prompt(askForJarLocation)
    let licensePathAnswer = yield inquirer.prompt(askForLicense)
    // let binInstallPathAnswer = yield inquirer.prompt(askForBinaryInstallPath)
    // let aemUsernameAnswer = yield inquirer.prompt(askForUsername)
    // let aemPasswordAnswer = yield inquirer.prompt(askForPassword)

    let bar = new ProgressBar('Setting up helper tools (step :current of 2): [:bar]', {total: 4})
    bar.tick()


    yield fst.checkToSeeIfJavaRuntimeEnvIsAvailable()
    bar.tick()
    console.log('java installed')
    yield fst.copyToLocation(licensePathAnswer.licensePath, `${config.paths.assets}/${config.assets.licenseFileName}`)
    bar.tick()
    yield fst.copyToLocation(jarPathAnswer.jarPath, `${config.paths.assets}/${config.assets.baseJarName}`)
    bar.tick()
    yield fst.extractVltCliTool(config.paths.bin)
    bar.tick()
    let inPath = yield fst.checkToSeeIfVltIsInPath()
    bar.tick()

    if(!inPath){
        console.log(chalk.bgCyan('Add the following to your environment path: <path to installed vault tools>'))
    }

    if(!inPath){
        console.log(chalk.bgCyan('Add the following to your environment path: <path to installed vault tools>'))
    }

    console.log(chalk.green('\nInitilization complete.'))
}).catch(error => {
    console.log(error)
})
