import keymap from './keymap';

export default function detectKey(event: any):string {
    let key:string = "";
    if(event.shiftKey) {
	key = `Shift+${key}`;
    }
    if(event.ctrlKey) {
	key = `Ctrl+${key}`;
    }
    if(event.altKey) {
	key = `Alt+${key}`;
    }
    if(event.metaKey) {
	key = `Meta+${key}`;
    }

    key += keymap[event.keyCode] || 'Unknown';
    return key;
}
