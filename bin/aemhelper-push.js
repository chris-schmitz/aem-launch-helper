#!/usr/bin/env node

const program = require('commander')
const {exec} = require('child_process')
const chalk = require('chalk')
const fst = require('../lib/FileSystemTools')
const notifier = require('../lib/Notifier')

program
    .option('-p, --port [port]', 'Port to use for push. Defaults to 4502.', /[0-9]+/, 4502)
    .option('-c, --credentials [user:password]', 'Credentials to use for push.')
    .parse(process.argv)

let credentials = program.credentials ? `--credentials ${program.credentials}` : ''

notifier('Pushing changes to AEM.', 'info', 'console')
console.log()
fst.pushToAEM(credentials, program.port)
    .then(stdout => notifier(stdout, 'success', 'both'))
    .catch(err => notifier(err, 'failure', 'both'))
