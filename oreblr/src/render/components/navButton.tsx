/// <reference path='../../browser/apps/tumblr/tumblr.d.ts' />

import * as React from 'react';
import { ipcRenderer } from 'electron';
require('../docs/style/navButton.scss');

interface GnavButtonProps {
    canReblog?: boolean;
    blogIdentifier?: string;
    params?: tumblr.reblogRequests;
}

interface GnavButtonStats {
    rendernize: boolean;
}

export class GnavButton extends React.Component<GnavButtonProps, GnavButtonStats> {
    private size: number = 18;
    private red: string = '#D95E40';
    private green: string = '#56BC8A';
    private is_reblogged: boolean = false;
    private is_liked: boolean = false;

    constructor(props: GnavButtonProps) {
        super(props);
        this.state = { rendernize: false };
    }

    public componentDidMount() {
	ipcRenderer.on('DidSuccessReblog', () => {
	    this.setState({ rendernize: true });
	});
    }

    public render() {
        if (this.props.canReblog) {
            return (
                <nav className='navButtons'>
                    {React.createElement(require('react-icons/lib/ti/arrow-repeat'), this.pickRebloged())}
                    {React.createElement(require('react-icons/lib/md/favorite'), this.pickLiked())}
                    {React.createElement(require('react-icons/lib/fa/chain'), { size: this.size, id: 'chainButton' })}
                </nav>
            );

        } else {
            return (
                <nav className='navButtons'>
                    {React.createElement(require('react-icons/lib/md/favorite'), this.pickLiked())}
                    {React.createElement(require('react-icons/lib/fa/chain'), { size: this.size, id: 'chainButton' })}
                </nav>
            );
        }
    }

    private pickRebloged() {
        return this.is_reblogged ?
            {
                style: { color: this.green },
                size: this.size + 5,
                id: 'reblogButton',
                onClick: () => {
                    ipcRenderer.send('DoReblog', this.props.blogIdentifier, this.props.params);
                    this.is_reblogged = true;
                }
            } :
            {
                size: this.size + 5,
                id: 'reblogButton',
                onClick: () => {
                    ipcRenderer.send('DoReblog', this.props.blogIdentifier, this.props.params);
                    this.is_reblogged = true;
                }
            };
    }

    private pickLiked() {
        return this.is_liked ?
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
