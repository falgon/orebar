import * as menubar from 'menubar';
import * as Electron from 'electron';
import * as makeKeyFromHTMLPath from '../utility/makeKeyFromHTMLPath';
import { menu } from '../../render/menu';
const Pack = require('../../../package.json');
interface execType { (): void };

export class Page {
    public mb: any;
    private topFrag: boolean;
    private showDockIcon: boolean;
    private ipcMain: NodeJS.EventEmitter;
    private nowOpenItemData: string = undefined;

    constructor(f: string) {
        this.topFrag = false;
        this.showDockIcon = false;
        this.ipcMain = Electron.ipcMain;

        this.mb = menubar();
        this.mb.setOption('dir', process.cwd());
        this.mb.setOption('tooltip', Pack['name']);

        let firsturi: string = 'file://' + __dirname + '/../../render/docs/tumblrAS.html';
        this.nowOpenItemData = makeKeyFromHTMLPath.makeKeyFromHTMLPath(firsturi);
        this.mb.setOption('index', firsturi);

        this.mb.setOption('alwaysOnTop', this.topFrag);
        this.mb.setOption('showDockIcon', this.showDockIcon);
        this.mb.setOption('preloadWindow', true);
        this.mb.setOption('backgroundColor', '#36465d');
        this.mb.setOption('width', 600);
        this.mb.setOption('height', 400);
        this.mb.setOption('minWidth', 600);
	this.mb.setOption('minHeight', 400);
	//this.mb.setOption('resizable', false); // will implementing
	this.mb.setOption('movable', false);

        this.mb.setOption('icon', __dirname + '/../../assets/menubaricon/icon.png');
        this.mb.on('after-hide', function() { this.mb.app.hide() }.bind(this));
        this.mb.on('after-create-window', function() {
            this.loadURL('file://' + f);
	    this.nowOpenItemData = menu[0];
        }.bind(this));
    }

    public loadURL(uri: string, Key: string) {
        this.mb.window.loadURL(uri);
        this.nowOpenItemData = Key;
    }

    downloadURL(url: string): void {
        this.mb.window.webContents.downloadURL(url);
    }

    set nowOpenItem(data: string) {
        this.nowOpenItemData = data;
    }

    get nowOpenItem() {
        return this.nowOpenItemData;
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
