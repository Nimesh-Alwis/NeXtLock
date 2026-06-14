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
function readFile() {

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
function deleteFile() {

}

// TEST
createFile("Test");


writeFile(
    "Gmail",
    "# Gmail\n\nUsername: gk@gmail.com"
);