#!/usr/bin/env node

const program   = require('commander')
const {exec}    = require('child_process')
const chalk     = require('chalk')
const gulp      = require('gulp')
const sass		= require('gulp-sass')
const path = require('path')
const logAndNotifiy = require('../lib/Notifier')
const {FileSystemTools} = require('../lib/FileSystemTools')
const fst = new FileSystemTools

program
    .option('-p, --port [port]', 'Port to use for push. Defaults to 4502.', /[0-9]+/, 4502)
    .option('-c, --credentials [user:password]', 'Credentials to use for push.')
    .option('--sassonly', 'Only compile sass', false)
    .parse(process.argv)



let credentials = program.credentials ? `--credentials ${program.credentials}` : ''
let sassOnly = program.sassonly;

if (!sassOnly) {
    gulp.watch(['jcr_root/**/*','!jcr_root/**/.vlt', '!jcr_root/**/*.scss', 'jcr_root/**/.content.xml'],
        () => {
            fst.pushToAEM(credentials, program.port)
                .then(stdout => logAndNotifiy(stdout, 'success', 'both'))
                .catch(err => logAndNotifiy(stdout, 'failure', 'both'))
        }
    )
        .on('change', event => console.log('File ' + event.path + ' was ' + event.type))
}

gulp.watch(['jcr_root/**/*.scss'],
	() => {}
)
    .on('change', (file) => {
        gulp.src(file.path, {base: 'jcr_root'})
            .pipe(sass({indentWidth: 2}))
            .on('error', sass.logError)
            .pipe(gulp.dest('jcr_root/'))

        logAndNotifiy([file.path,' was compiled'].join(''), 'success', 'both')

    })

logAndNotifiy("Gulp's watch has begun. Gulp is the shield that guards the realms of AEM.", 'success', 'both')
