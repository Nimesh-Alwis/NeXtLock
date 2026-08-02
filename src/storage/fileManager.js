const fs = require("fs");
const path = require("path");

function getDataPath(fileName) {
    let dataDir = path.join(__dirname, "../../data");
    try {
        const { app } = require("electron");
        if (app && typeof app.getPath === "function") {
            dataDir = path.join(app.getPath("userData"), "data");
        }
    } catch (e) {
        // Fallback for non-electron runtime
    }

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    return path.join(dataDir, `${fileName}.md`);
}

// Create file
function createFile(fileName) {
    console.log("Creating file...");
    const filePath = getDataPath(fileName);
    fs.writeFileSync(filePath, "");
    console.log(`${fileName}.md created at ${filePath}`);
}

// Read file
function readFile(fileName) {
    const filePath = getDataPath(fileName);
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf8");
    console.log(content);
    return content;
}

// Write file
function writeFile(fileName, content) {
    const filePath = getDataPath(fileName);
    fs.writeFileSync(filePath, content);
    console.log(`${fileName}.md updated at ${filePath}`);
}

// Delete file
function deleteFile(fileName) {
    const filePath = getDataPath(fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`${fileName}.md deleted`);
    }
}

function renameFile(oldFileName, newFileName) {
    const oldPath = getDataPath(oldFileName);
    const newPath = getDataPath(newFileName);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`${oldFileName}.md renamed to ${newFileName}.md`);
    }
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