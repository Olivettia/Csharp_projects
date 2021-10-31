const fs = require('fs');
const path = require('path');
const uglify = require('uglify-js');

const sourceDirectory = 'src';
const destinationDirectory = 'build';

if (path.existsSync(destinationDirectory)) {
    var oldFileNames = fs.readdirSync(destinationDirectory);
    for (var i = 0; i < oldFileNames.length; i++) {
        var oldFileName = path.join(destinationDirectory, oldFileNames[i]);
        fs.unlinkSync(oldFileName);
    }
    fs.rmdirSync(destinationDirectory);
    console.log('removed build directory');
} else {
    console.log('build directory doesn\'t exist');
}

fs.mkdirSync(destinationDirectory, '755');
console.log('created build directory');

var fileNames = fs.readdirSync(sourceDirectory);
var allFiles = [];

for (var i = 0; i < fileNames.length; i++) {
    var sourceFileName = path.join(sourceDirectory, fileName