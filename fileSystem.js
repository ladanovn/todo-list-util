const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

// TODO PE; 2018-08-20; переименовать?
async function getAllFilePathsWithExtension(directoryPath, extension, filePaths) {
    filePaths = filePaths || [];
    const fileNames = await readdirAsync(directoryPath);

    promises = [];
    for (const fileName of fileNames) {
        const filePath = path.join(directoryPath, fileName);
        promises.push(statAsync(filePath)
            .then(async stats => {
                if (stats.isDirectory()) {
                    await getAllFilePathsWithExtension(filePath, extension, filePaths);
                } else if (filePath.endsWith(`.${extension}`)) {
                    filePaths.push(filePath);
                }
            }));
    }
    await Promise.all(promises);
    return filePaths;
}

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf8'); // TODO Veronika; 2018-08-16; сделать кодировку настраиваемой
}

function getFileName(filePath) {
    return path.basename(filePath);
}

module.exports = {
    getAllFilePathsWithExtension,
    readFile,
    getFileName
};