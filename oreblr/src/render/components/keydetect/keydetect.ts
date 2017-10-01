/// <reference path='./keyevent.d.ts' />
import keyMap from './keyMap';

export default function detectKey(event: HTMLElementEvent<HTMLInputElement>): string {
    let keyString: string = '';
    if (event.shiftKey) {
        keyString = `Shift+${keyString}`;
    }
    if (event.ctrlKey) {
        keyString = `Ctrl+${keyString}`;
    }
    if (event.altKey) {
        keyString = `Alt+${keyString}`;
    }
    if (event.metaKey) {
        keyString = `Meta+${keyString}`;
    }
    keyString += keyMap[event.keyCode] || 'Unknown';
    return keyString;
}
