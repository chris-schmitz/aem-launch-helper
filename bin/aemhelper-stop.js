#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const {exec} = require('child_process')
const fs = require('fs')

exec('ps x', {maxBuffer: 1024 * 500}, (err, stdout, stderr) => {
    if(err) throw new Error(chalk.red(err))
    if(stderr) throw new Error(chalk.red(stderr))

    console.log(stdout)
})