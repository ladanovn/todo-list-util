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
    const userCommandReg = /^user\s([a-zа-я]+)$/i;
    const dateCommandReg = /^date\s(\d{4}(-\d{2})?(-\d{2})?)$/;

    if (trimedCommand === 'show') {
        todoHandler
            .getAll()
            .print();

    } else if (trimedCommand === 'important') {
        todoHandler
            .getAll()
            .selectImportant()
            .print();

    } else if (userCommandReg.test(trimedCommand)) {
        const userName = trimedCommand.match(userCommandReg)[1];
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

    } else if (dateCommandReg.test(trimedCommand)) {
        const commandDate = trimedCommand.match(dateCommandReg);
        const date = new Date(commandDate[1]);

        todoHandler
            .getAll()
            .selectDate(date)
            .print();

    } else if (trimedCommand === 'exit') {
        process.exit(0);

    } else {
        console.log('wrong command');  
    }
}
