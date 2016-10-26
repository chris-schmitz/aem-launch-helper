#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const co = require('co')
const {appSettings} = require('../appSettings')
const fst = require('../lib/FileSystemTools')
const notifier = require('../lib/Notifier')

program
    .option(
        '-e, --environment [env]',
        `The AEM environment you would like to create. availableEnvironments: ${appSettings.availableEnvironments.join(', ')}.`,
        new RegExp(`^(${appSettings.availableEnvironments.join('|')})$`),
        new Error(chalk.red('Invalid environment argument'))
    )
    .parse(process.argv)

if(program.environment instanceof Error){
    notifier(program.environment, 'failure', 'both')
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
    notifier(result, 'success', 'both')
}).catch(error => notifier(error, 'failure', 'both'))
