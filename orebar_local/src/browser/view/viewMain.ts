const Viewmodule = require('./view.js');

export function browser_main(): void {
    let view = new Viewmodule.Page('src/browser/view/docs/dash.html');
    
    view.mb.on('ready', function ready() {
	console.log('app is ready');
    });
}
