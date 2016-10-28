#!/usr/bin/env node

const program = require('commander')
const {exec} = require('child_process')
const chalk = require('chalk')
const notifier = require('../lib/Notifier')


program
    .option('-p, --port [port]', 'Port to use for pull. Defaults to 4502.')
    .option('-c, --credentials [user:password]', 'Credentials to use for pull.')
    .parse(process.argv)

let credentials = program.credentials ? `--credentials ${program.credentials}` : ''
let port = program.port || '4502'
let command = `vlt ${credentials} co http://localhost:${port}/crx --force`

exec(command, (err, stdout, stderr) => {
	if(err) {
        notifier(err, 'failure', 'both')
	}
    notifier(stdout, 'success', 'both')
})
