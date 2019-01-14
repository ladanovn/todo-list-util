const readline = require('readline');
const {stdin, stdout} = process;

const rl = readline.createInterface(stdin, stdout);

function readLine(callback) {
    rl.on('line', callback); // TODO pe; 2015-08-10; а какая будет кодировка?
}

// TODO digi; 2016-04-08; добавить writeLine!!!

module.exports = {
    readLine
};
