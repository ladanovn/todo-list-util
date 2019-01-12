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
        this.uploadedFiles.forEach(file => {
            this._getTodos(file.filename, file.data);
        });
    }

    getAll() {
        this.filteredTODOs = JSON.parse(JSON.stringify(this.uploadedTODOs));
        return this;
    }

    print() {
        let printingTable = '';
        const authorLen = this._calcColumnWidth('author', 10);
        const dateLen = this._calcColumnWidth('date', 10);
        const commentLen = this._calcColumnWidth('comment', 50);
        const filenameLen = this._calcColumnWidth('filename', 15);
        const tableLen = authorLen + dateLen + commentLen + filenameLen + 20;
        const tableHead = `  !  |` + 
                          `  ${'user'.padEnd(authorLen)}  |` +
                          `  ${'date'.padEnd(dateLen)}  |` +
                          `  ${'comment'.padEnd(commentLen)}  |` +
                          `  ${'fileName'.padEnd(filenameLen)}\n` +
                          `  ${''.padEnd(tableLen, '-')}\n`;
        printingTable += tableHead;

        for (let todo of this.filteredTODOs) {
            const tableRow = `` +
                `${this._padTableCell(`${todo.important ? '!': ''}`, 1)}|` + 
                `${this._padTableCell(`${todo.author || ''}`.padEnd(authorLen))}|` +
                `${this._padTableCell(`${todo.date || ''}`.padEnd(dateLen))}|` +
                `${this._padTableCell(`${todo.comment || ''}`.padEnd(commentLen))}|` +
                `${this._padTableCell(`${todo.filename}`.padEnd(filenameLen))}\n`;
            printingTable += tableRow;
        }
        console.log(printingTable);
    }

    _getTodos(filename, data) {
        let result;
        const commentReg = /\/\/\s*TODO[\s:]+(.+)/gmi;
        const specMarkupReg = /([a-zа-я]+);\s*(\d{4}-\d{2}-\d{2});\s*(.+)/i;
        while (result = commentReg.exec(data)) {
            const todo = result[1];
            const specMarkupTodo = todo.match(specMarkupReg);

            if (specMarkupTodo) {
                this.uploadedTODOs.push({
                    author: specMarkupTodo[1],
                    date: specMarkupTodo[2],
                    comment: specMarkupTodo[3],
                    important: (specMarkupTodo[3].match(/!/g) || []).length,
                    filename
                });
            } else {
                this.uploadedTODOs.push({
                    comment: todo,
                    important: (todo.match(/!/g) || []).length,
                    filename
                });
            }
        }
    }

    _calcColumnWidth(todoProp, maxWidth) {
        let columnWidth = 0;
        for (let todo of this.filteredTODOs) {
            const propVal = todo[todoProp];
            if (propVal) {
                if (propVal.length >= maxWidth) {
                    return maxWidth;
                } else {
                    const propLen = propVal.length;
                    columnWidth = propLen > columnWidth ? propLen: columnWidth;
                }
            }
        };
        return columnWidth;
    }

    _padTableCell(str, maxWidth) {
        if (str.length > maxWidth) {
            return `  ${str.substr(0, maxWidth - 3)}...  `;
        }
        return `  ${str.padEnd(maxWidth)}  `;
    }
}