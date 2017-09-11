const Viewmodule = require('./view.js');

export function browser_main(): void {
    let view = new Viewmodule.Page(__dirname + '/docs/dash.html');
    
    view.mb.on('ready', function ready() {
	console.log('app is ready');
    });
}
