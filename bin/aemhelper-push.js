#!/usr/bin/env node

const program = require('commander')
const {exec} = require('child_process')
const chalk = require('chalk')

program
    .option('-p, --port [port], Port to use for push. Defaults to 4502.')
    .option('-c, --credentials [user:password], Credentials to use for push.')
    .parse(process.argv)

let credentials = program.credentials ? `--credentials ${program.credentials}` : ''
let port = program.port || '4502'

let command = `vlt ${credentials} import http://localhost:${port}/crx ./ /`
console.log(command)

exec(command, (err, stdout, stderr) => {
    if(err) throw new Error(chalk.red(err))
    // if(stderr) throw new Error(chalk.red(stderr))

    console.log(chalk.green(stdout))
})
