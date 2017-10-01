interface HTMLElementEvent<T extends HTMLElement> extends Event {
    target: T;
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    keyCode: number;
}
