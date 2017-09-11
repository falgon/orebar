'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});
const packr = require('electron-packager');
const os = require('os');
const pack = require('../orebar/package.json');

function build(plt, arc) {
    var settings = {
        name: pack['name'],
        dir: __dirname + '/../orebar',
        out: __dirname + '/dist',
        platform: plt,
        arch: arc,
        overwrite: true,
        asar: false,
        version: '1.7.5',
        'app-version': packr['version'],
        'app-copyright': 'Copyright (C) 2017 ' + packr['author'] + '.'
    };

    if (plt === 'win32') {
        settings['icon'] = '../orebar/src/assets/win32/icon.ico';
        settings['version-string'] = {
            CompanyName: 'roki',
            FileDescription: packr['name'],
            OriginalFilename: packr['name'] + '.exe',
            ProductName: packr['name'],
            InternalName: packr['name']
        };
    } else if (plt === 'darwin') {
        settings['icon'] = '../orebar/src/assets/darwin/icon.icns';
    } else if (plt == 'linux') {
	settings['icon'] = '../orebar/src/assets/linux/icon.png';
    }

    console.log('Target platform: ' + plt + '\nArch: ' + arc);
    packr(settings, function(err, appPaths) {
        if (err)
            console.log(err);
        else
            console.log('Orebar build succeeded: ' + appPaths);
    });
}

function main() {
    build(os.platform(), os.arch());
}

main();
