const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { TodoHandler } = require('./TodoHandler');

app();

function app () {
    const files = getFiles();
    const todoHandler = new TodoHandler();
    // todoHandler.loadFiles(files);
    
    console.log('Please, write your command!');
    // readLine(processCommand);
}

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    // return filePaths.map(path => readFile(path));
    return filePaths;
}

function processCommand (command) {
    switch (command) {
        case 'show':
            // todoHandler.showAll()
            break;
        case 'important':
            break;
        case 'user':
            break;
        case 'sort':
            break;
        case 'date':
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
