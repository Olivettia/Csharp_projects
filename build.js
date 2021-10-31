const fs = require('fs');
const path = require('path');
const uglify = require('uglify-js');

const sourceDirectory = 'src';
const destinationDirectory = 'build';

if (path.existsSync(destinationDirectory)) {
    var oldFileNames = fs.re