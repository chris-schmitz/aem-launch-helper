#!/usr/bin/env node
const program = require('commander')
const {version} = require('../appSettings')

program
    .version(version)
    .command('create [options]', 'Creates a new environment for an AEM instance. Note that this _does not_ start the instance.')
    .command('start [options]', 'Starts the AEM environment instance per the given environment string.')
    .command('stop [options]', 'Stops the AEM environment instance per the given environment string.')
    .command('restart [options]', 'Stops and Starts the AEM environment instance per the given environment string.')
    .command('slay [options]', 'Stops the AEM instance and deletes the crx-quickstart directory.')
    .command('push [options]', 'Push changes to aem instance.')
    .parse(process.argv)
