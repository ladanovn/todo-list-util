const readline = require('readline');
const {stdin, stdout} = process;

stdin.setEncoding('utf8');
const rl = readline.createInterface(stdin, stdout);

function readLine(callback) {
    rl.on('line', callback);
}

function writeLine(date) {
    console.log(date);
}

module.exports = {
    readLine,
    writeLine 
};
