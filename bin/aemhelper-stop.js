#!/usr/bin/env node


const program = require('commander')
const chalk = require('chalk')
const {exec} = require('child_process')
const fs = require('fs')
const {appSettings} = require('../appSettings')
const co = require('co')
const {FileSystemTools} = require('../lib/FileSystemTools')
let fst = new FileSystemTools

program
    .option(
        '-e, --environment [env]',
        `The AEM environment you would like to stop. availableEnvironments: ${appSettings.availableEnvironments.join(', ')}.`,
        new RegExp(`^(${appSettings.availableEnvironments.join('|')})$`),
        new Error(chalk.red('Invalid environment argument'))// if the value provied doesn't match the regex, error out
    )
    .option('-a, --all', 'Kill all running instances of AEM.')
    .parse(process.argv)

// If we aren't killing all instances we need to make sure that we're using a
// valid environment string to target the process(es) to kill.
if(program.all === undefined && program.environment instanceof Error){
    console.error(program.environment)
    return
}

function matchesJarPattern(string){
    if(program.all){
        return string.match(appSettings.requiredAemFilePatterns[0])
    }

    return string.match(new RegExp(`aem-${program.environment}-[0-9]+.jar`))
}

exec('ps x', appSettings.maxBuffer, (err, stdout, stderr) => {
    if(err) throw new Error(chalk.red(err))
    if(stderr) throw new Error(chalk.red(stderr))

    let jarProcesses =
        stdout.toString()
              .split('\n')
              .filter(matchesJarPattern)
              .map(processLine => processLine.match(/^\s+?([0-9]+)/)) // note that the ouput of `ps x` may have a space or spaces padding the first column
              .filter(processIdMatch => processIdMatch.length >= 2 ) // i.e. we found a match for our pattern and were able to see group 1 (`([0-9]+)`) from the match
              .map(processMatch => processMatch[1])

    if(jarProcesses.length === 0){
        console.log(chalk.blue("Cannot find an AEM instance to stop."))
        return
    }
    console.log(jarProcesses.map(processLine => processLine.match(/^./)))

/*
    let jarProcessIds = jarProcesses.map(processLine => processLine.match(/^[0-9]+/)[0])

    if(jarProcessIds.length === 0){
        console.log(chalk.blue('There are no aem instance processes running.'))
        return
    }

    Promise.all(jarProcessIds.map(id => fst.killProcess(id)))
        .then(result => console.log(chalk.green(result.join('\n'))))
        .catch(err => console.log(chalk.red(err)))
        */
})
