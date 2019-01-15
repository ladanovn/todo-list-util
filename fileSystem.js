const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);

async function getFilesWithExtension(directoryPath, extension, filePaths) {
    filePaths = filePaths || [];
    const fileNames = await readdirAsync(directoryPath);

    promises = [];
    for (const fileName of fileNames) {
        const filePath = path.join(directoryPath, fileName);
        promises.push(statAsync(filePath)
            .then(async stats => {
                if (stats.isDirectory()) {
                    await getFilesWithExtension(filePath, extension, filePaths);
                } else if (filePath.endsWith(`.${extension}`)) {
                    filePaths.push(filePath);
                }
            }));
    }
    await Promise.all(promises);
    return filePaths;
}

async function readFile(filePath) {
    const buffer = await readFileAsync(filePath);
    return decoder.end(buffer);
}

function getFileName(filePath) {
    return path.basename(filePath);
}

module.exports = {
    getFilesWithExtension,
    readFile,
    getFileName
};
