#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const {exec} = require('child_process')

program
    .option('-e, --environment, The name of the environment you would like to start.')
    .parse(process.argv)

const env