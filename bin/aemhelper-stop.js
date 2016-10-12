#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const {exec} = require('child_process')
const fs = require('fs')
const {appSettings} = require('../appSettings')

function matchesJarPattern(string){
    /*
     | Blergh, I don't like doing it this way. I went through all of the trouble
     | to make the app settings flexible so that we didn't need to care about
     | what patterns were needed and what environment strings were valid. I'm
     | being _ultra lazy_ here and calling the pattern needed via index b/c it's
     | breakfast and I want to get some stuff built before going to work.
     | Later, come back and refactor the `appSettings.requiredAemFilePatterns`
     | to use object values with key names instead of just an array. This way
     | we can just say `appSettings.requiredAemFilePatterns.jarFile` to pull the
     | pattern so that the position of the pattern in the array is irrelevant.
     | Who knows if I'll actually come back and do this ;P. If nothing else this
     | comment block is here to point out that I _definitely recognize_ that
     | it _should_ be done.
    */
    return string.match(appSettings.requiredAemFilePatterns[0])
}

exec('ps x', appSettings.maxBufferValue, (err, stdout, stderr) => {
    if(err) throw new Error(chalk.red(err))
    if(stderr) throw new Error(chalk.red(stderr))

    let jarProcessIds =
        stdout.toString()
              .split('\n')
              .filter(matchesJarPattern)
              .map(processLine => processLine.match(/^[0-9]+/)[0])


    if(jarProcessIds.length === 0){
        console.log(chalk.blue('There are no aem instance processes running.'))
        return
    }

    jarProcessIds.forEach(id => {
        exec(`kill -9 ${id}`, (err, stdout, stderr) => {
            if(err) throw new Error(chalk.red(err))
            if(stderr) throw new Error(chalk.red(stderr))
            console.log(chalk.green(`AEM process ${id} killed.`));
        })
    })
})
