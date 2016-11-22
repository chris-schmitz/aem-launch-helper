#!/usr/bin/env node

const program   = require('commander')
const {exec}    = require('child_process')
const chalk     = require('chalk')
const gulp      = require('gulp')
const sass		= require('gulp-sass')
const autoprefixer  = require('gulp-autoprefixer')
const path = require('path')
const logAndNotify = require('../lib/Notifier')
const fst = require('../lib/FileSystemTools')
const fs = require('fs')

program
    .option('-p, --port [port]', 'Port to use for push. Defaults to 4502.', /[0-9]+/, 4502)
    .option('-c, --credentials [user:password]', 'Credentials to use for push.')
    .option('--sassonly', 'Only compile sass', false)
    .parse(process.argv)



let credentials = program.credentials ? `--credentials ${program.credentials}` : ''
let sassOnly = program.sassonly;

// If you're not in the parent directory of the `jcr_root` folder the watch will never trigger per the watch paths
// defined below. This check makes sure that you're in the right place before watching so that you don't sit there
// saving your files and wondering why the watch action never triggers :P
if(fs.readdirSync('./').filter(fileOrFolder => fileOrFolder === 'jcr_root').length === 0){
    throw new Error(chalk.red('You must be in a directory that contains the "jcr_root" folder to use this watcher.'))
}

if (!sassOnly) {
    gulp.watch(['jcr_root/**/*','!jcr_root/**/.vlt', '!jcr_root/**/*.scss', 'jcr_root/**/.content.xml'],
        () => {
            fst.pushToAEM(credentials, program.port)
                .then(stdout => logAndNotify(stdout, 'success', 'both'))
                .catch(err => logAndNotify(stdout, 'failure', 'both'))
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
            .pipe(autoprefixer())
            .pipe(gulp.dest('jcr_root/'))

        logAndNotify([file.path,' was compiled'].join(''), 'success', 'both')

    })

logAndNotify("Gulp's watch has begun. Gulp is the shield that guards the realms of AEM.", 'success', 'both')
