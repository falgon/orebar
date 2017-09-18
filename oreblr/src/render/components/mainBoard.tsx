import * as React from 'react';
import * as TumblrParser from '../../browser/apps/tumblr/tmbrDashboardParse';
import { ipcRenderer } from 'electron';
const Loader = require('react-loaders').Loader;
require('../docs/style/loader.scss');
require('../docs/style/dash.scss');
require('../docs/style/sidemenu.scss');

interface MainBoardStates {
    data?: any, is_authorized?: boolean;
}

export class MainBoard extends React.Component<any, MainBoardStates> {
    constructor(props: any) {
        super(props);

        this.state = { data: this.props.defaultValue, is_authorized: false };
        ipcRenderer.send('tumblrAuthorization');
        ipcRenderer.on('authorizeComplete', (_: any, tmbr: any, limit: number) => {
            ipcRenderer.removeAllListeners('authorizeComplete');
            const tmbrParse = new TumblrParser.tmbrDashboardParse(tmbr, limit);

            this.setState({ data: tmbrParse.blogName(0), is_authorized: true });
        });
    }

    public componentDidMount() {
        this.setState({ data: 'Waiting authorization...' });
    }

    private loading() {
        return (
            <div className="centernize">
                <Loader type='square-spin' />
            </div>
        );
    }

    private loaded() {
        return (
            <div><h2>Section</h2><p>{this.state.data}</p></div>
        );
    }

    private displayMain() {
        return this.state.is_authorized ? this.loaded() : this.loading();
    }

    public render() {
        return (
            <main id='panel'>
                <section>
                    {this.displayMain()}
                </section>
            </main>
        );
    }
}
