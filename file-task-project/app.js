const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'input');

const files = fs.readdirSync(inputDir);
//list of all the files in input dir

let combinedContent = " ";
files.forEach(file => {
    const filePath = path.join(inputDir, file);
    const fileContent = fs.readFileSync(filePath,'utf-8');
    combinedContent += fileContent + "\n";
})

const outputFile = path.join(__dirname, 'output.txt');
fs.writeFileSync(outputFile, combinedContent);
