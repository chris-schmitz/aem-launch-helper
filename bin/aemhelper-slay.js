#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const co = require('co')
const {appSettings} = require('../appSettings')
const {FileSystemTools} = require('../lib/FileSystemTools')
const fst = new FileSystemTools

program
    .option(
        '-e, --environment [env]',
        `The AEM environment you would like to create. availableEnvironments: ${appSettings.availableEnvironments.join(', ')}.`,
        new RegExp(`^(${appSettings.availableEnvironments.join('|')})$`),
        new Error(chalk.red('Invalid environment argument'))
    )
    .parse(process.argv)

if(program.environment instanceof Error){
    throw program.environment
}

let confirm = {
    type: 'confirm',
    name: 'delete',
    message: `You are about to delete the ${program.environment} environment. This will destroy all of the instance data and it cannot be undone!\nAre you sure you want to delete the ${program.environment} environment?`,
}


co(function *(){
    let answer = yield inquirer.prompt(confirm)
    if(!answer.delete) return

    let result = yield fst.destroyEnvironment(program.environment)
    console.log(chalk.green(result))
}).catch(error => console.error(chalk.red(error)))
