#!/usr/bin/env node

const program   = require('commander')
const {exec}    = require('child_process')
const chalk     = require('chalk')
const gulp      = require('gulp')
const {pushToAEM} = require('../lib/FileSystemTools')

program
    .option('-p, --port [port]', 'Port to use for push. Defaults to 4502.', /[0-9]+/, 4502)
    .option('-c, --credentials [user:password]', 'Credentials to use for push.')
    .parse(process.argv)

let credentials = program.credentials ? `--credentials ${program.credentials}` : ''

gulp.watch(['jcr_root/**/*','!jcr_root/**/.vlt', 'jcr_root/**/.content.xml'],
    () => {
        pushToAEM(credentials, program.port)
            .then(stdout => console.log(chalk.green(stdout)))
            .catch(err => console.error(chalk.red(err)))
    }
)
    .on('change', event => console.log('File ' + event.path + ' was ' + event.type))

console.log(chalk.green("Gulp's watch has begun. Gulp is the shield that guards the realms of AEM."))
