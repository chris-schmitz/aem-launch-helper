const notifier = require('node-notifier')
const chalk = require('chalk')
const path = require('path')

/**
 * Sends a notification message to the console, the os, or both.
 * @param  {String} message        The message you would like to send.
 * @param  {String} [type='info']  The type of message it is.
 *                                 Options: info, success, failure, warning.
 * @param  {String} [logTo='both'] Where you would like to send the message.
 *                                 Options: os, console, both.
 *
 * Note that you can notify with an error that will halt the process. e.g.:
 *
 *  notifier(new Error('Invalid environment argument'), 'failure', 'console')
 */
module.exports = function(message, type = 'info', logTo = 'both'){

    if(logTo === 'both' || logTo === 'os'){
        notifyOS(message, type)
    }

    if(logTo === 'both' || logTo === 'console'){
        logToConsole(message, type)
    }
}


// Ok, we're at the point where we're throwing around a lot of arguments over
// and over. Come back and refactor this whole module to be a class so that
// we can access stuff like type and message via `this.type` and `this.message`.
function logToConsole(message, type){
    console.log(chalk[determineColor(type)](message))

    // I'm opting for a process exit here instead of an error throw b/c I think
    // it looks cleaner as far as user experience. When you rework this as a
    // class, consider giving the dev the ability to decide here if they want to
    // exit cleanly or throw the error.
    if(message instanceof Error){
        process.exit()
    }
}

function determineColor(type){
    switch (type){
        case 'info': return 'blue';
        case 'success': return 'green';
        case 'failure': return 'red';
        case 'warning': return 'yellow';
    }
    throw new Error('Invalid notification type.')
}

function determineIcon(type){
    let pathToAssets = path.resolve(__dirname, '..', 'assets', 'icons')

    switch (type){
        case 'info': return path.resolve(pathToAssets, 'info.png');
        case 'success': return path.resolve(pathToAssets, 'success.png');
        case 'failure': return path.resolve(pathToAssets, 'error.png');
        case 'warning': return path.resolve(pathToAssets, 'warning.png');
    }
    throw new Error('Invalid notification type.')
}

function notifyOS(message, type){

    notifier.notify({
        title: type,
        icon: determineIcon(type),
        message: message
    })
}
