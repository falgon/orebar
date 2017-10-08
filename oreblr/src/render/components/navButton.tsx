import * as React from 'react';
import { ipcRenderer } from 'electron';
require('../docs/style/navButton.scss');

interface GnavButtonProps {
    is_reblogged?: boolean;
    is_liked?: boolean;
}

interface GnavButtonStats {
    rendernize: boolean;
}

export class GnavButton extends React.Component<GnavButtonProps, GnavButtonStats> {
    private size: number = 18;
    private red: string = '#D95E40';
    private green: string = '#56BC8A';

    constructor(props: GnavButtonProps) {
        super(props);
        this.state = { rendernize: false };
    }

    public render() {
        return (
            <nav className='navButtons'>
                {React.createElement(require('react-icons/lib/ti/arrow-repeat'), this.pickRebloged())}
                {React.createElement(require('react-icons/lib/md/favorite'), this.pickLiked())}
                {React.createElement(require('react-icons/lib/fa/chain'), { size: this.size, id: 'chainButton' })}
            </nav>
        );
    }

    private pickRebloged() {
        return this.props.is_reblogged ?
            {
                style: { color: this.green },
                size: this.size + 5,
                id: 'reblogButton',
                OnClick: () => ipcRenderer.send('DoUnReblog')
            } :
            {
                size: this.size + 5,
                id: 'reblogButton',
                OnClick: () => ipcRenderer.send('DoReblog')
            };
    }
    private pickLiked() {
        return this.props.is_liked ?
            {
                style: { color: this.red },
                size: this.size,
                id: 'likeButton',
                OnClick: () => ipcRenderer.send('DoUnLike')
            } :
            {
                size: this.size,
                id: 'likeButton',
                OnClick: () => ipcRenderer.send('DoLike')
            };
    }
}
