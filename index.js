const TodoHandler = require('./TodoHandler');
const { readLine } = require('./console');
const { getAllFilePathsWithExtension } = require('./fileSystem');
const todoHandler = new TodoHandler();

app();

async function app () {
    const files = await getFiles();
    await todoHandler.loadFiles(files);
    console.log('Please, write your command!');
    readLine(processCommand);
}

async function getFiles () {
    const filePaths = await getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths;
}

function processCommand (command) {
    const trimedCommand = command.trim();
    if (trimedCommand === 'show') {
        todoHandler
            .getAll()
            .print();

    } else if (trimedCommand === 'important') {
        todoHandler
            .getAll()
            .selectImportant()
            .print();

    } else if (/^user\s[a-zа-я]+$/i.test(trimedCommand)) {
        const userName = trimedCommand.match(/^user\s([a-zа-я]+)$/i)[1];
        todoHandler
            .getAll()
            .selectUser(userName)
            .print();

    } else if (trimedCommand === 'sort importance') {
        todoHandler
            .getAll()
            .sortByImportance()
            .print();

    } else if (trimedCommand === 'sort user') {
        todoHandler
            .getAll()
            .sortByUser()
            .print();

    } else if (trimedCommand === 'sort date') {
        todoHandler
            .getAll()
            .sortByDate()
            .print();

    } else if (trimedCommand === 'date') {

    } else if (trimedCommand === 'exit') {
        process.exit(0);
    } else {
        console.log('wrong command');  
    }
}

// TODO you can do it!
