const notifier = require('node-notifier')
const chalk = require('chalk')
const path = require('path')

module.exports = function(message, type = 'info', logTo = 'both'){

    if(logTo === 'both' || logTo === 'os'){
        notifyOS(message, type)
    }

    if(logTo === 'both' || logTo === 'console'){
        console.log(chalk[determineColor(type)](message))
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
