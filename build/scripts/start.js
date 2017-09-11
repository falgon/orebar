#! /usr/bin/env node

'use strict';
exports.__esModule = true;
const child_process = require('child_process');
const os = require('os');

var genend = function (x) { return ' ' + __dirname + '/../dist/orebar-' + os.platform() + '-' + os.arch() + '/orebar.' + x; };
var cmd = '';

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
