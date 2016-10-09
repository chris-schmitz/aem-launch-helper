#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const chalk = require('chalk')
const co = require('co')
const {exec} = require('child_process')
const {appPaths, isAValidEnvironment} = require('../appSettings')
const {directoryContainsRequiredAEMFiles,openJarFile} = require('../lib/FileSystemTools')

program
    .option('-e, --environment <env>, The name of the environment you would like to start.')
    .parse(process.argv)

if(!isAValidEnvironment(program.environment)){
    console.error(chalk.red(`The argument ${program.environment} is not a valid environment name.`))
    return
}

co(function *(){
    const targetPath = `${appPaths.environmentBuildDirectory}/${program.environment}`
    let hasFiles = yield directoryContainsRequiredAEMFiles(targetPath)
    yield openJarFile(`${targetPath}/aem-${program.environment}-*.jar`)
    console.log(chalk.green(`AEM ${program.environment} enviornment starting up...`))
})
.catch(error => {throw new Error(chalk.red(error))})
