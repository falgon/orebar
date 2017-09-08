const Viewmodule = require('./src/browser/view/view.js');

function main() : void {
	let view = new Viewmodule.View();
	view.on_ready(function(){
		console.log('app is ready');
	});
}

main();
