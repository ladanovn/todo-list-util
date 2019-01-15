const { getFileName } = require('./fileSystem');
const { readFile } = require('./fileSystem');
const { writeLine } = require('./console');
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

    selectImportant() {
        this.filteredTODOs = this.filteredTODOs.filter(todo => {
            return todo.important
        });
        return this;
    }

    selectUser(name) {
        const regex = new RegExp(`^${name}`, "i");
        this.filteredTODOs = this.filteredTODOs.filter(todo => {
            return regex.test(todo.user);
        });
        return this;
    }

    selectDate(date) {
        this.filteredTODOs = this.filteredTODOs.filter(todo => {
            if (!todo.date) return false;
            return new Date(todo.date) >= date;
        });  
        return this;  
    }

    print() {
        let printingTable = '';
        const userLen = this._calcColumnWidth('user', 10);
        const dateLen = this._calcColumnWidth('date', 10);
        const commentLen = this._calcColumnWidth('comment', 50);
        const filenameLen = this._calcColumnWidth('filename', 15);
        const tableLen = userLen + dateLen + commentLen + filenameLen + 25;
        const tableHead = `  !  |` + 
                          `  ${'user'.padEnd(userLen)}  |` +
                          `  ${'date'.padEnd(dateLen)}  |` +
                          `  ${'comment'.padEnd(commentLen)}  |` +
                          `  ${'fileName'.padEnd(filenameLen)}  \n` +
                          `${''.padEnd(tableLen, '-')}\n`;
        printingTable += tableHead;

        for (let todo of this.filteredTODOs) {
            const tableRow = `` +
                `${this._padTableCell(`${todo.important ? '!': ''}`, 1)}|` + 
                `${this._padTableCell(`${todo.user || ''}`.padEnd(userLen))}|` +
                `${this._padTableCell(`${todo.date || ''}`.padEnd(dateLen))}|` +
                `${this._padTableCell(`${todo.comment || ''}`.padEnd(commentLen))}|` +
                `${this._padTableCell(`${todo.filename}`.padEnd(filenameLen))}\n`;
            printingTable += tableRow;
        }
        if (this.filteredTODOs.length > 0) {
            printingTable += `${''.padEnd(tableLen, '-')}`;
        }
        writeLine(printingTable);
    }

    sortByImportance() {
        this.filteredTODOs = this.filteredTODOs.sort((a, b) => {
            return a.important >= b.important ? -1 : 1
        });
        return this;
    }

    sortByUser() {
        this.filteredTODOs = this.filteredTODOs.sort((a, b) => {
            if (!b.user) return -1;
            if (!a.user) return 1;
            const aLower = a.user.toLowerCase();
            const bLower = b.user.toLowerCase();
            return aLower.localeCompare(bLower);
        });
        return this;
    }

    sortByDate() {
        this.filteredTODOs = this.filteredTODOs.sort((a, b) => {
            if (!b.date) return -1;
            if (!a.date) return 1;
            return new Date(a.date) > new Date(b.date) ? -1 : 1
        });
        return this;
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
                    user: specMarkupTodo[1],
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
        let columnWidth = todoProp.length;
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