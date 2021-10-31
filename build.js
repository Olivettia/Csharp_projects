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
    conso