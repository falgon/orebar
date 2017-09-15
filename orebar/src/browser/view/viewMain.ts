const Viewmodule = require('./view.js');
const Pack = require('../../../package.json');

export function browser_main(): void {
    let view = new Viewmodule.Page(__dirname + '/../../render/docs/dash.html');
    
    view.mb.on('ready', function() : void {
	console.log(Pack['name'] + ': Ready');
    });

    view.ipcMain.on('clicked_quit',() => {
	console.log(Pack['name'] + ': Bye!');
	view.mb.app.quit();
    });
}
