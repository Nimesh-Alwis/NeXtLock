// File Manager

const fs = require("fs");

// Create file
function createFile(fileName) {

    console.log("Creating file...");

    fs.writeFileSync(
        `./data/${fileName}.md`,
        ""
    );

    console.log(
        `${fileName}.md created`
    );

}

// Read file
function readFile(fileName) {

    const content = fs.readFileSync(
        `data/${fileName}.md`,
        "utf8"
    );

    console.log(content);
}

// Write file
function writeFile(fileName, content) {

    fs.writeFileSync(
        `data/${fileName}.md`,
        content
    );

    console.log(
        `${fileName}.md updated`
    );

}

// Delete file
// Delete file
function deleteFile(fileName) {

    fs.unlinkSync(
        `data/${fileName}.md`
    );

    console.log(
        `${fileName}.md deleted`
    );
}

function renameFile(oldFileName, newFileName) {

    fs.renameSync(
        `./data/${oldFileName}.md`,
        `./data/${newFileName}.md`
    );

    console.log(
        `${oldFileName}.md renamed to ${newFileName}.md`
    );
}

// TEST
//deleteFile("Test");


//writeFile(
  //  "Gmail",
    //"# Gmail\n\nUsername: gk@gmail.com"
//);


module.exports = {
    createFile,
    readFile,
    writeFile,
    deleteFile,
    renameFile
};