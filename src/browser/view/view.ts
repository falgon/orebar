import * as menubar from 'menubar';
interface execType{() :void};

export class View{
	private mb : any;

	constructor(){
		this.mb = menubar();
		//		this.mb.setOption('index','./index.html');
	}

	public on_ready(x:execType){
		this.mb.on('ready',function ready() {
			x();
		});
	}

};
