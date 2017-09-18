#! /usr/bin/env node

'use strict';
exports.__esModule = true;
const child_process = require('child_process');
const os = require('os');

const genend = function (x) { return ' ' + __dirname + '/../dist/oreblr-' + os.platform() + '-' + os.arch() + '/oreblr.' + x; };
let cmd = '';

if (os.platform() == 'darwin') {
    cmd = 'open' + genend('app');
}
else if (os.platform() == 'win32') {
    cmd = genend('exe');
}
else if (os.platform() == 'linux') {
    cmd = genend('');
}

child_process.exec(cmd,(err,stdout,stderr) => {
    if(err){ console.log(err); }
    console.log(stdout);
});
