const TodoHandler = require('./TodoHandler');
const { readLine } = require('./console');
const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');

app();

async function app () {
    const files = await getFiles();
    const todoHandler = new TodoHandler();
    await todoHandler.loadFiles(files);
    
    console.log('Please, write your command!');
    // readLine(processCommand);
}

async function getFiles () {
    const filePaths = await getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths;
}

function processCommand (command) {
    switch (command.trim()) {
        case 'show':
            // todoHandler
            //  .getAll()
            //  .print();
            break;
        case 'important':
            // todoHandler
            //  .getAll()
            //  .selectImportant()
            //  .print()
            break;
        case 'user':
            // todoHandler
            //  .getAll()
            //  .selectUser()
            //  .print()
            break;
        case 'sort':
            // todoHandler
            //  .getAll()
            //  .sort('importance')
            //  .print()
            break;
        case 'date':
            // todoHandler
            //  .getAll()
            //  .selectDate('2016-03')
            //  .print()
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
