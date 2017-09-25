/// <referehce path='../../browser/apps/tumblr/tumblr.d.ts' />
import * as React from 'react';
import { tmbrDashboardParse } from '../../browser/apps/tumblr/tmbrDashboardParse';
import { tmbrLikesParse } from '../../browser/apps/tumblr/tmbrLikesParse';
import { ipcRenderer } from 'electron';
import { menu } from '../menu';

const VisibilitySensor = require('react-visibility-sensor');
const Loader = require('react-loaders').Loader;
require('../docs/style/loader.scss');
require('../docs/style/dash.scss');
require('../docs/style/sidemenu.scss');

interface MainBoardStates {
    menuStatus?: string;
    is_authorized?: boolean;
    disableMoreLoad?: boolean;
}

export class MainBoard extends React.Component<undefined, MainBoardStates> {
    constructor(props: undefined) {
        super(props);

        this.state = { menuStatus: menu[0], is_authorized: false, disableMoreLoad: true };
        this.init();
        this.sidebar_button_events();
        this.change_column_events();
        this.more_loading_events();
    }

    public componentDidMount() {
        // this.articles = undefined;
    }

    public render() {
        const jsxElement = this.render_impl();

        return this.state.is_authorized ? (this.articles.length ? jsxElement : this.gotEmpty()) : jsxElement;
    }

    private articles: JSX.Element[] = [];
    private removeTag: (_: string) => string = (x: string) => x.replace(/<\/?[^>]+(>|$)/g, '');

    private init() {
        ipcRenderer.send('tumblrAuthorization');

        ipcRenderer.on('authorizeComplete', (_: {}, tmbr: {}, limit: number) => {
            ipcRenderer.removeAllListeners('authorizeComplete');
            // TODO: check empty data
            this.articles.push(this.getBlogArticles(new tmbrDashboardParse(tmbr, limit)));
            this.setState({ is_authorized: true, disableMoreLoad: false });
        });
    }

    private gotEmpty() {
        this.articles.length = 0;
        return (
            <main id='panel'>
                <div className='centernize'>
                    {React.createElement(require('react-icons/lib/md/no-sim'), null)}
                    <p>No posts to display.</p>
                </div>
            </main>
        );
    }

    private sidebar_button_events() {
        ipcRenderer.on('reloaded_data', (_: {}, Item: string, tmbr: {}, limit: number) => {
            if (Item === menu[0]) {
                this.articles.length = 0;
                // TODO: check empty data
                this.articles.push(this.getBlogArticles(new tmbrDashboardParse(tmbr, limit)));
                this.setState({ is_authorized: true, menuStatus: Item });
            } else if (Item === menu[1]) {
                this.articles.length = 0;
                const likesParser = new tmbrLikesParse(tmbr, limit);

                if (likesParser.liked_count()) {
                    this.articles.push(this.getBlogArticles(new tmbrLikesParse(tmbr, limit)));
                }
                this.setState({ is_authorized: true, menuStatus: Item });
            } // TODO: other sidebar reloaded
        });

        ipcRenderer.on('disp_info', (_: {}) => {
            // TODO: disp info
        });
    }

    private change_column_events() {
        ipcRenderer.on(menu[0], (_: {}, tmbr: {}, limit: number) => {
            this.articles.length = 0;
            // TODO: check empty data
            this.articles.push(this.getBlogArticles(new tmbrDashboardParse(tmbr, limit)));
            this.setState({ is_authorized: true, menuStatus: menu[0] });
        });

        ipcRenderer.on(menu[1], (_: {}, tmbr: {}, limit: number) => {
            this.articles.length = 0;
            const likesParser = new tmbrLikesParse(tmbr, limit);

            if (likesParser.liked_count()) {
                this.articles.push(this.getBlogArticles(likesParser));
            }
            this.setState({ is_authorized: true, menuStatus: menu[1] });
        });

        ipcRenderer.on(menu[2], (_: {}, tmbr: any, __: number) => {
            this.articles.length = 0;
            this.articles.push(<p>{tmbr.users[0].name}</p>);
            this.setState({ is_authorized: true, menuStatus: menu[2] });
        });

        // TODO: other change column event
    }

    private more_loading_events() {
        ipcRenderer.on(menu[0] + '_moreLoaded', (_: {}, tmbr: {}, limit: number) => {
            // TODO: check empty data
            this.setState({ disableMoreLoad: true });
            this.articles.push(this.getBlogArticles(new tmbrDashboardParse(tmbr, limit))); /////
            this.setState({ is_authorized: true, menuStatus: menu[0], disableMoreLoad: false });
        });

        ipcRenderer.on(menu[1] + '_moreLoaded', (_: {}, tmbr: {}, limit: number) => {
            this.setState({ disableMoreLoad: true });
            const likesParser = new tmbrLikesParse(tmbr, limit);

            if (likesParser.liked_count()) {
                this.articles.push(this.getBlogArticles(likesParser));
            }
            this.setState({ is_authorized: true, menuStatus: menu[1], disableMoreLoad: false });
        });

        // TODO: other change more loading event
    }

    private getBlogArticles(tmbrParse: tmbrDashboardParse | tmbrLikesParse) {

        let tmp: [string, string | tumblr.ImageProper][] = [];

        for (let i = 0; i < tmbrParse.readLimit; ++i) {
            if (tmbrParse.postType(i) === 'photo') {
                tmp.push([tmbrParse.postType(i), tmbrParse.original_image(i)]);
            } else if (tmbrParse.postType(i) === 'text') {
                tmp.push([tmbrParse.postType(i), this.removeTag(tmbrParse.body(i))]);
            } else if (tmbrParse.postType(i) === 'quote') {
                // TODO: quote
            } else if (tmbrParse.postType(i) === 'link') {
                // TODO: link
            } else if (tmbrParse.postType(i) === 'chat') {
                // TODO: chat
            } else if (tmbrParse.postType(i) === 'audio') {
                // TODO: audio
            } else if (tmbrParse.postType(i) === 'video') {
                // TODO: video
            }
        }


        return (
            <div>
                {
                    tmp.map((item: [string, tumblr.ImageProper]) => {
                        if (item[0] === 'photo') {
                            return <img className='dashPhoto' src={item[1].url} />;
                        } else if (item[0] === 'text') {
                            return <div className='textPhoto'>{item[1]}</div>;
                        } else if (item[0] === 'quote') {
                            // TODO: quote
                        } else if (item[0] === 'link') {
                            // TODO: link
                        } else if (item[0] === 'chat') {
                            // TODO: chat
                        } else if (item[0] === 'audio') {
                            // TODO: audio
                        } else if (item[0] === 'video') {
                            // TODO: video
                        }
                    })
                }
            </div>
        );
    }

    private loading() {
        return (
            <div className='aligner'>
                <div className='centernize'><Loader type='square-spin' /></div>
            </div>
        );
    }

    private loaded() {
        if (this.state.menuStatus === menu[0]) { // Dashboard
            return (
                <div id='photos'>
                    {this.articles.map((item: JSX.Element) => item)}
                </div>
            );
        } else if (this.state.menuStatus === menu[1]) { // Likes
            return (
                <div id='photos'>
                    {this.articles.map((item: JSX.Element) => item)}
                </div>
            );
        } else if (this.state.menuStatus === menu[2]) { // Follows
            return (
                <div>
                    <h2>{menu[2]}</h2>
                    {this.articles}
                </div>
            );
        } else if (this.state.menuStatus === menu[3]) { // MyBlogs
            return (
                <div>
                    <h2>MyBlogs Section</h2>
                    <p>{this.articles}</p>
                </div>
            );
        } else if (this.state.menuStatus === menu[4]) { // Popular
            return (
                <div>
                    <h2>Popular Section</h2>
                    <p>{this.articles}</p>
                </div>
            );
        } else if (this.state.menuStatus === menu[5]) { // Settings
            return (
                <div>
                    <h2>Settings Section</h2>
                    <p>{this.articles}</p>
                </div>
            );
        } else if (this.state.menuStatus === menu[6]) { // About
            return (
                <div>
                    <h2>About Section</h2>
                    <p>{this.articles}</p>
                </div>
            );
        }
        return <div><h2>Section</h2><p>Loading Error</p></div>;
    }

    private displayMain() {
        return this.state.is_authorized ? this.loaded() : this.loading();
    }

    private loadMore() {
        ipcRenderer.send(this.state.menuStatus + '_more');
    }

    private render_impl() {
        return (
            <main id='panel'>
                <section>
                    {this.displayMain()}
                </section>
                <div className='centernize'>
	    		<Loader type='square-spin' />
                	<VisibilitySensor onChange={(isVisible: boolean) => { if (isVisible && (!this.state.disableMoreLoad)) { this.loadMore(); } }} />
	    	</div>
            </main>
        );
    }
}
