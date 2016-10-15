#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const co = require('co')
const {baseJarExists, createEnvironmentDirectory, copyToLocation} = require('../lib/FileSystemTools')
const {appSettings, isAValidEnvironment} = require('../appSettings')

const {assets} = require('../config')

program
    .option(`-e, --environment <env>`, `The name of the environment to create this instance for.\n\t\tValid environment values are: ${appSettings.availableEnvironments.join(', ')}\n`)
    .option('-p, --port <port>', 'The port you want associated with this instance.')
    .option('-l, --license <licensepath>', 'The path to the license file that will used for this instance.')
    .parse(process.argv)


function generateEnviromentSpecificJarName(){
    return `aem-${program.environment}-${program.port}.jar`
}

if(!isAValidEnvironment(program.environment)){
    console.error(chalk.red(`The argument ${program.environment} is not a valid environment name.`))
    return
}

co(function *(){
    let baseJarLocation = yield baseJarExists()
    let envDirectory = yield createEnvironmentDirectory(program.environment)
    let jarFileCreated = yield copyToLocation(baseJarLocation, `${envDirectory}/${generateEnviromentSpecificJarName()}`)
    let licenseCoppied = yield copyToLocation(program.license, `${envDirectory}/${assets.licenseFileName}`)
    console.log(chalk.green(`The ${program.environment} environment has been created.`))
}).catch(error => {
    console.error(chalk.red(error))
})
