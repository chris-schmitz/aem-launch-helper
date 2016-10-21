#!/usr/bin/env node

const program = require('commander')
const {exec} = require('child_process')
const chalk = require('chalk')
const {FileSystemTools} = require('../lib/FileSystemTools')
const fst = new FileSystemTools

program
    .option('-p, --port [port]', 'Port to use for push. Defaults to 4502.', /[0-9]+/, 4502)
    .option('-c, --credentials [user:password]', 'Credentials to use for push.')
    .parse(process.argv)

let credentials = program.credentials ? `--credentials ${program.credentials}` : ''

fst.pushToAEM(credentials, program.port)
    .then(stdout => console.log(chalk.green(stdout)))
    .catch(err => console.error(chalk.red(err)))
