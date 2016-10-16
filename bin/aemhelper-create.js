#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const co = require('co')
const {appSettings, isAValidEnvironment} = require('../appSettings')
const {assets} = require('../config')
const {FileSystemTools} = require('../lib/FileSystemTools')
const fst = new FileSystemTools

program
    .option('-p, --port <port>', 'The port you want associated with this instance.', /[0-9]+/, 4502)
    // at some point it would be good to set the default value per the env specified, but for now I'm find with just defaulting to 4502.
    .option(
        '-e, --environment [env]',
        `The AEM environment you would like to stop. availableEnvironments: ${appSettings.availableEnvironments.join(', ')}.`,
        new RegExp(`^(${appSettings.availableEnvironments.join('|')})$`),
        new Error(chalk.red('Invalid environment argument'))
    )
    .option(
        '-l, --license <licensepath>',
        'The path to the license file that will used for this instance.',
        /.+\/license\.properties$/,
        new Error(chalk.red('You must provide a license file.'))
    )
    .parse(process.argv)

if(program.license instanceof Error){
    throw program.license
}

// If we aren't killing all instances we need to make sure that we're using a
// valid environment string to target the process(es) to kill.
if(program.all === undefined && program.environment instanceof Error){
    console.error(program.environment)
    return
}

function generateEnviromentSpecificJarName(){
    return `aem-${program.environment}-${program.port}.jar`
}

if(!isAValidEnvironment(program.environment)){
    console.error(chalk.red(`The argument ${program.environment} is not a valid environment name.`))
    return
}

co(function *(){
    let baseJarLocation = yield fst.baseJarExists()
    let envDirectory = yield fst.createEnvironmentDirectory(program.environment)
    let jarFileCreated = yield fst.copyToLocation(baseJarLocation, `${envDirectory}/${generateEnviromentSpecificJarName()}`)
    let licenseCoppied = yield fst.copyToLocation(program.license, `${envDirectory}/${assets.licenseFileName}`)
    console.log(chalk.green(`The ${program.environment} environment has been created.`))
}).catch(error => {
    console.error(chalk.red(error))
})
