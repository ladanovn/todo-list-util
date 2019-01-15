const readline = require('readline');
const {stdin, stdout} = process;

const rl = readline.createInterface(stdin, stdout);

function readLine(callback) {
    rl.on('line', callback); // TODO pe; 2015-08-10; а какая будет кодировка?
}

function writeLine(date) {
    console.log(date);
}

module.exports = {
    readLine,
    writeLine 
};
