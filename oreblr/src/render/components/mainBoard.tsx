import * as React from 'react';
import * as TumblrParser from '../../browser/apps/tumblr/tmbrDashboardParse';
import { ipcRenderer } from 'electron';
import { menu } from '../menu';
const Loader = require('react-loaders').Loader;
require('../docs/style/loader.scss');
require('../docs/style/dash.scss');
require('../docs/style/sidemenu.scss');

interface MainBoardStates {
    blogNames?: any;
    menuStatus?: string;
    is_authorized?: boolean;
}

export class MainBoard extends React.Component<any, MainBoardStates> {
    constructor(props: any) {
        super(props);

        this.state = { blogNames: this.props.defaultValue, menuStatus: 'Dashboard', is_authorized: false };

        ipcRenderer.send('tumblrAuthorization');
        ipcRenderer.on('authorizeComplete', (_: any, tmbr: any, limit: number) => {
            ipcRenderer.removeAllListeners('authorizeComplete');

            const titles = this.getBlogTitles(tmbr, limit);
            this.setState({ blogNames: titles, is_authorized: true });
        });

        for (let item of menu) {
            ipcRenderer.on(item, () => {
                this.setState({ menuStatus: item });
            });
        }
    }

    private getBlogTitles(tmbr: any, limit: any) {
        const tmbrParse = new TumblrParser.tmbrDashboardParse(tmbr, limit);

        let tmp: string[] = [];
        for (let i = 0; i < limit; ++i) {
            tmp.push(tmbrParse.blogName(i));
        }
        return tmp.map((item: string) => {
            return <li>{item}</li>
        });
    }

    public componentDidMount() {
        this.setState({ blogNames: 'Waiting authorization...' });
    }

    private loading() {
        return (
            <div className='aligner'>
                <div className='centernize'><Loader type='square-spin' /></div>
            </div>
        );
    }

    private loaded() {
        if (this.state.menuStatus === menu[0]) {
            return (
                <div>
                    <h2>Section</h2>
                    <ul>{this.state.blogNames}</ul>
                </div>
            );
        } else if (this.state.menuStatus === menu[1]) {
            return (
                <div>
                    <h2>Likes Section</h2>
                    <ul>{this.state.blogNames}</ul>
                </div>
            );
        } else if (this.state.menuStatus === menu[2]) {
            return (
                <div>
                    <h2>Follows Section</h2>
                    <ul>{this.state.blogNames}</ul>
                </div>
            );
        } else if (this.state.menuStatus === menu[3]) {
            return (
                <div>
                    <h2>MyBlogs Section</h2>
                    <ul>{this.state.blogNames}</ul>
                </div>
            );
        } else if (this.state.menuStatus === menu[4]) {
            return (
                <div>
                    <h2>Popular Section</h2><ul>{this.state.blogNames}</ul>
                </div>
            );
        } else if (this.state.menuStatus === menu[5]) {
            return (
                <div>
                    <h2>Settings Section</h2><ul>{this.state.blogNames}</ul>
                </div>
            );
        } else if (this.state.menuStatus === menu[6]) {
            return (
                <div>
                    <h2>About Section</h2><ul>{this.state.blogNames}</ul>
                </div>
            );
        }
        return <div><h2>Section</h2><p>Loading Error</p></div>;
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
