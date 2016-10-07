#!/usr/bin/env node
const program = require('commander')

program
    .version('0.1.0')
    .command('create [options] <path>', 'Creates a new environment for an AEM instance. Note that this _does not_ start the instance.')
    .command('start <env>', 'Starts the AEM environment instance per the given environment string.')
    .command('stop <env>', 'Stops the AEM environment instance per the given environment string.')
    .command('restart <env>', 'Stops and Starts the AEM environment instance per the given environment string.')
    .command('slay <env>', 'Stops the AEM instance and deletes the crx-quickstart directory.')
    .parse(process.argv)