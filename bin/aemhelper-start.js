#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const chalk = require('chalk')
const co = require('co')
const {exec} = require('child_process')
const {appSettings, isAValidEnvironment} = require('../appSettings')
const fst = require('../lib/FileSystemTools')


program
    .option(
        '-e, --environment [env]',
        `The AEM environment you would like to start. availableEnvironments: ${appSettings.availableEnvironments.join(', ')}.`,
        new RegExp(`^(${appSettings.availableEnvironments.join('|')})$`),
        new Error(chalk.red('Invalid environment argument'))// if the value provied doesn't match the regex, error out
    )
    // .option('-a, --all, Start all available environments.')
    .parse(process.argv)

// If we aren't killing all instances we need to make sure that we're using a
// valid environment string to target the process(es) to kill.
if(program.all === undefined && program.environment instanceof Error){
    console.error(program.environment)
    return
}
co(function *(){
    const targetPath = `${appSettings.environmentBuildDirectory}/${program.environment}`
    yield fst.directoryContainsRequiredAEMFiles(targetPath)
    yield fst.openJarFile(`${targetPath}/aem-${program.environment}-*.jar`)
    console.log(chalk.green(`AEM ${program.environment} enviornment starting up...`))
})
.catch(error => {throw new Error(chalk.red(error))})
