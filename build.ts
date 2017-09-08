import * as packr from 'electron-packager'; 
const pack = require('./package.json');

packr({
    name: pack['name'],
    dir: '.',
    out: './dist',
    icon: './src/assets/icon.ico',
    platform: 'darwin',
    arch: 'x64',
    overwrite: true,
    asar: false,

    /*'version-string': {// Windowsのみのオプション
        CompanyName: 'totoraj.net',
        FileDescription: pack['name'],
        OriginalFilename: pack['name']+'.exe',
        ProductName: pack['name'],
        InternalName: pack['name']
    }*/

}, function (err : any, appPaths : string) {
    if (err) console.log(err);
    console.log('orebar build succeeded: ' + appPaths);
});
