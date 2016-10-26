#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const co = require('co')
const {appSettings, isAValidEnvironment} = require('../appSettings')
const {assets} = require('../config')
const fst = require('../lib/FileSystemTools')
const notifier = require('../lib/Notifier')

program
    .option('-p, --port <port>', 'The port you want associated with this instance.', /[0-9]+/, 4502)
    // at some point it would be good to set the default value per the env specified, but for now I'm find with just defaulting to 4502.
    .option(
        '-e, --environment [env]',
        `The AEM environment you would like to create. availableEnvironments: ${appSettings.availableEnvironments.join(', ')}.`,
        new RegExp(`^(${appSettings.availableEnvironments.join('|')})$`),
        new Error(`Invalid environment name.`)
    )
    .option(
        '-l, --license <licensepath>',
        'The path to the license file that will used for this instance.',
        /.+\/license\.properties$/,
        new Error('You must provide a license file.')
    )
    .parse(process.argv)

if(program.license instanceof Error){
    notifier(program.license, 'failure', 'console')
}

// If we aren't killing all instances we need to make sure that we're using a
// valid environment string to target the process(es) to kill.
if(program.all === undefined && program.environment instanceof Error){
    notifier(program.environment, 'failure', 'console')
}

function generateEnviromentSpecificJarName(){
    return `aem-${program.environment}-${program.port}.jar`
}

if(!isAValidEnvironment(program.environment)){
    notifier(`The argument ${program.environment} is not a valid environment name.`, 'failure', 'console')
}

co(function *(){
    let baseJarLocation = yield fst.baseJarExists()
    let envDirectory = yield fst.createEnvironmentDirectory(program.environment)
    let jarFileCreated = yield fst.copyToLocation(baseJarLocation, `${envDirectory}/${generateEnviromentSpecificJarName()}`)
    let licenseCoppied = yield fst.copyToLocation(program.license, `${envDirectory}/${assets.licenseFileName}`)
    notifier(`The ${program.environment} environment has been created.`, 'success,', 'console')
}).catch(error => {
    notifier(error, 'failure', 'console')
})
