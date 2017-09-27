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
    rendernize: boolean;
}

export class MainBoard extends React.Component<undefined, MainBoardStates> {
    constructor(props: undefined) {
        super(props);
        this.state = { rendernize: false };
        this.init();
        this.sidebar_button_events();
        this.change_column_events();
        this.more_loading_events();
    }

    public render() {
        const jsxElement = this.render_impl();
        return this.is_authorized ? (this.articles.length ? jsxElement : this.gotEmpty()) : jsxElement;
    }

    private menuStatus: string = menu[0];
    private is_authorized: boolean = false;
    private disableMoreLoad: boolean = true;
    private articles: JSX.Element[] = [];
    private removeTag: (_: string) => string = (x: string) => x.replace(/<\/?[^>]+(>|$)/g, '');

    private clear() {
        this.articles.length = 0;
    }

    private init() {
        ipcRenderer.send('tumblrAuthorization');

        ipcRenderer.on('authorizeComplete', (_: {}, tmbr: {}, limit: number) => {
            ipcRenderer.removeAllListeners('authorizeComplete');
            this.is_authorized = true;
            this.menuStatus = menu[0];
            const dashParse = new tmbrDashboardParse(tmbr, limit);

            if (dashParse.count_post()) {
                this.articles.push(this.getBlogArticles(dashParse));
            }
            this.disableMoreLoad = false;
            this.setState({ rendernize: true });
        });
    }

    private gotEmpty() {
        this.clear();

        return (
            <main id='panel'>
                <div className='centernize'>
                    <p id='noPosts'>{React.createElement(require('react-icons/lib/md/no-sim'), { size: 90 })}<span className='br' id='noPostsMes'>No posts to display.</span></p>
                </div>
            </main>
        );
    }

    private sidebar_button_events() {
        ipcRenderer.on('reloaded_data', (_: {}, Item: string, tmbr: {}, limit: number) => {
            this.clear();

            if (Item === menu[0]) {

                const dashParser = new tmbrDashboardParse(tmbr, limit);

                if (dashParser.count_post()) {
                    this.articles.push(this.getBlogArticles(dashParser));
                }
                this.setState({ rendernize: true });

            } else if (Item === menu[1]) {

                const likesParser = new tmbrLikesParse(tmbr, limit);

                if (likesParser.count_post()) {
                    this.articles.push(this.getBlogArticles(likesParser));
                }
                this.setState({ rendernize: true });

            }
            // TODO: other sidebar reloaded
        });

        ipcRenderer.on('disp_info', (_: {}) => {
            // TODO: disp info
        });
    }

    private change_column_events() {
        ipcRenderer.on(menu[0], (_: {}, tmbr: {}, limit: number) => {
            this.clear();
            this.menuStatus = menu[0];
            this.disableMoreLoad = true;

            const dashParser = new tmbrDashboardParse(tmbr, limit);

            if (dashParser.count_post()) {
                this.articles.push(this.getBlogArticles(dashParser));
            }
            this.disableMoreLoad = false;
            this.setState({ rendernize: true });
        });

        ipcRenderer.on(menu[1], (_: {}, tmbr: {}, limit: number) => {
            this.clear();
            this.menuStatus = menu[1];
            this.disableMoreLoad = true;

            const likesParser = new tmbrLikesParse(tmbr, limit);

            if (likesParser.count_post()) {
                this.articles.push(this.getBlogArticles(likesParser));
            }

            this.disableMoreLoad = false;
            this.setState({ rendernize: true });
        });

        ipcRenderer.on(menu[2], (_: {}, tmbr: any, __: number) => {
            this.clear();
            this.menuStatus = menu[2];
            this.disableMoreLoad = true;

            this.articles.push(<p>{tmbr.users[0].name}</p>);
            this.disableMoreLoad = false;
            this.setState({ rendernize: true });
        });

        // TODO: other change column event
    }

    private more_loading_events() {

        ipcRenderer.on(menu[0] + '_moreLoaded', (_: {}, tmbr: {}, limit: number) => {
            // TODO: check empty data
            if (!this.disableMoreLoad) {
                this.disableMoreLoad = true;
                this.menuStatus = menu[0];
                const dashParser = new tmbrDashboardParse(tmbr, limit);

                if (dashParser.count_post()) {
                    this.articles.push(this.getBlogArticles(dashParser));
                }
                this.disableMoreLoad = false;
                this.setState({ rendernize: true });
            }
        });

        ipcRenderer.on(menu[1] + '_moreLoaded', (_: {}, tmbr: {}, limit: number) => {
            if (!this.disableMoreLoad) {
                this.disableMoreLoad = true;
                this.menuStatus = menu[1];
                const likesParser = new tmbrLikesParse(tmbr, limit);

                if (likesParser.count_post()) {
                    this.articles.push(this.getBlogArticles(likesParser));
                }
                this.disableMoreLoad = false;
                this.setState({ rendernize: true });
            }
        });

        // TODO: other change more loading event
    }

    private getBlogArticles(tmbrParse: tmbrDashboardParse | tmbrLikesParse) {

        let tmp: [string, string | tumblr.ImageProper][] = [];

        for (let i = 0; i < tmbrParse.count_post(); ++i) { // range over
            switch (tmbrParse.postType(i)) {
                case 'photo': {
                    tmp.push([tmbrParse.postType(i), tmbrParse.original_image(i)]);
                    break;
                }
                case 'text': {
                    tmp.push([tmbrParse.postType(i), this.removeTag(tmbrParse.body(i))]);
                    break;
                }
                case 'quote': {
                    // TODO: quote
                    break;
                }
                case 'link': {
                    // TODO: link
                    break;
                }
                case 'chat': {
                    // TODO: chat
                    break;
                }
                case 'audio': {
                    // TODO: audio
                    break;
                }
                case 'video': {
                    // TODO: video
                    break;
                }
                default: {
                }
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
        if (this.menuStatus === menu[0]) { // Dashboard
            return (
                <div id='photos'>
                    {this.articles.map((item: JSX.Element) => item)}
                </div>
            );
        } else if (this.menuStatus === menu[1]) { // Likes
            return (
                <div id='photos'>
                    {this.articles.map((item: JSX.Element) => item)}
                </div>
            );
        } else if (this.menuStatus === menu[2]) { // Follows
            return (
                <div>
                    <h2>{menu[2]}</h2>
                    {this.articles}
                </div>
            );
        } else if (this.menuStatus === menu[3]) { // MyBlogs
            return (
                <div>
                    <h2>MyBlogs Section</h2>
                    <p>{this.articles}</p>
                </div>
            );
        } else if (this.menuStatus === menu[4]) { // Popular
            return (
                <div>
                    <h2>Popular Section</h2>
                    <p>{this.articles}</p>
                </div>
            );
        } else if (this.menuStatus === menu[5]) { // Settings
            return (
                <div>
                    <h2>Settings Section</h2>
                    <p>{this.articles}</p>
                </div>
            );
        } else if (this.menuStatus === menu[6]) { // About
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
        return this.is_authorized ? this.loaded() : this.loading();
    }

    private loadMore() {
        ipcRenderer.send(this.menuStatus + '_more');
    }

    private render_impl() {
        return (
            <main id='panel'>
                <section>
                    {this.displayMain()}
                </section>
                <div className='centernize'>
                    <Loader type='square-spin' />
                    <VisibilitySensor onChange={(isVisible: boolean) => { if (isVisible && (!this.disableMoreLoad)) { this.loadMore(); } }} />
                </div>
            </main>
        );
    }
}
