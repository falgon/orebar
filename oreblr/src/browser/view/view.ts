import * as menubar from 'menubar';
import * as Electron from 'electron';
const Pack = require('../../../package.json');
interface execType { (): void };

export class Page {
    public mb: any;
    private topFrag: boolean;
    private showDockIcon: boolean;
    private ipcMain: NodeJS.EventEmitter;

    constructor(f: string) {
        this.topFrag = false;
	this.showDockIcon = false;
	this.ipcMain = Electron.ipcMain;

	this.mb = menubar();
	this.mb.setOption('dir',process.cwd());
        this.mb.setOption('tooltip', Pack['name']);
	this.mb.setOption('index','file://' + __dirname + '/../../render/docs/tumblrAS.html');
        this.mb.setOption('alwaysOnTop', this.topFrag);
        this.mb.setOption('showDockIcon', this.showDockIcon);
        this.mb.setOption('preloadWindow', true);
	this.mb.setOption('width',600);
	this.mb.setOption('height',400);
	this.mb.setOption('minWidth',600);
	this.mb.setOption('minHeight',400);

	this.mb.setOption('icon', __dirname + '/../../assets/menubaricon/icon.png');
	this.mb.on('after-hide', () => { this.mb.app.hide() });

	this.mb.on('after-create-window', () => { this.mb.window.loadURL('file://' + f); });
    }

    downloadURL(url:string):void{
	this.mb.window.webContents.downloadURL(url);
    }
    
    get app() {
        return this.mb.app;
    }

    get browser_window() {
        return this.mb.window;
    }

    get tray() {
        return this.mb.tray;
    }

    get electon_positioner() {
        return this.mb.positioner;
    }

    public getOption(option: string): any {
        return this.mb.getOption(option);
    }

    public on_ready(x: execType): void {
        this.mb.on('ready', function ready() {
            x();
        });
    }
};
