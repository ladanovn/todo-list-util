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
                }) 
        }));
    }

}