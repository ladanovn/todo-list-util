const { getFileName } = require('./fileSystem');
const { readFile } = require('./fileSystem');
module.exports = class TodoHandler {

    constructor() {
        this.uploadedFiles = [];
        this.uploadedTODOs = [];
        this.filteredTODOs = [];
    }

    async loadFiles(filePaths) {
        this.uploadedFiles = await Promise.all(
            [ ...filePaths ].map(filePath => {
            return readFile(filePath)
                .then(data => {
                    return {
                        filename: getFileName(filePath),
                        data
                    }
                });
        }));
        this.uploadedFiles.forEach(data => {
            this._getTodos(data.data);
        });
    }

    _getTodos(data) {
        let result;
        const commentReg = /\/\/\s*TODO[\s:]+(.+)/gmi;
        const specMarkupReg = /([a-zа-я]+);\s*(\d{4}-\d{2}-\d{2});\s*(.+)/i;
        while (result = commentReg.exec(data)) {
            const todo = result[1];
            const specMarkupTodo = todo.match(specMarkupReg);

            if (specMarkupTodo) {
                this.uploadedTODOs.push({
                    author: specMarkupTodo[1],
                    date: new Date(specMarkupTodo[2]),
                    comment: specMarkupTodo[3]
                });
            } else {
                this.uploadedTODOs.push({
                    comment: todo
                });
            }
        }
    }
}