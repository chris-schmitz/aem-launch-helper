#!/usr/bin/env node

const program = require('commander')
const {exec} = require('child_process')
const chalk = require('chalk')
const {pushToAEM} = require('../lib/FileSystemTools')

program
    .option('-p, --port [port]', 'Port to use for push. Defaults to 4502.')
    .option('-c, --credentials [user:password]', 'Credentials to use for push.')
    .parse(process.argv)

let credentials = program.credentials ? `--credentials ${program.credentials}` : ''
let port = program.port || '4502'

pushToAEM(credentials, port)
    .then(stdout => console.log(chalk.green(stdout)))
    .catch(err => console.error(chalk.red(err)))
