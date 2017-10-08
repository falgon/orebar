/// <reference path='../../browser/apps/tumblr/tumblr.d.ts' />
/// <reference path='./keydetect/keyevent.d.ts' />
/// <reference path='./error/dnsError.d.ts' />

import * as React from 'react';
import { TmbrDashboardParse } from '../../browser/apps/tumblr/tmbrDashboardParse';
import { TmbrLikesParse } from '../../browser/apps/tumblr/tmbrLikesParse';
import { ipcRenderer } from 'electron';
import { menu } from '../menu';
import { postTypes } from '../menu';
import { dnsError } from './error/dnsError';
import { polyfill } from 'smoothscroll-polyfill';
import { GnavButton } from './navButton';
import Masonry from 'react-masonry-component';
import detectKey from './keydetect/keydetect';
const VisibilitySensor = require('react-visibility-sensor');
const Loader = require('react-loaders').Loader;
require('../docs/style/loader.scss');
require('../docs/style/dash.scss');
require('../docs/style/sidemenu.scss');
require('../docs/style/hoverPost.scss');

interface MainBoardStates {
    rendernize: boolean;
}

export class MainBoard extends React.Component<undefined, MainBoardStates> {
    private menuStatus: string = menu[0];
    private is_authorized: boolean = false;
    private ErrorStatus: DnsError = undefined;
    private disableMoreLoad: boolean = true;
    private articles: JSX.Element[] = [];
    private postCount: number = 0;
    private postIDPrefix = 'postID_';
    private nowSelectedPostID: number = 0;
    private hasDataSize: number = 0;

    constructor(props: undefined) {
        super(props);
        polyfill();
        this.state = { rendernize: false };
    }

    public render() {
        const jsxElement = this.render_impl();
        return this.is_authorized ? (this.articles.length ? jsxElement : this.gotEmpty()) : jsxElement;
    }

    public componentDidMount() {
        this.init();
        this.sidebar_button_events();
        this.change_column_events();
        this.more_loading_events();
	this.responcePosts();
        this.keyInput();
    }

    private removeTag: (_: string) => string = (x: string) => x.replace(/<\/?[^>]+(>|$)/g, '');

    private clear() {
        this.articles.length = 0;
    }

    private init() {
        ipcRenderer.send('tumblrAuthorization');

        ipcRenderer.on('authorizeComplete', (_: {}, tmbr: tumblr.DashboardResponse.basic, limit: number) => {
            ipcRenderer.removeAllListeners('authorizeComplete');
            this.is_authorized = true;
            this.menuStatus = menu[0];
            const dashParse = new TmbrDashboardParse(tmbr, limit);

            if (dashParse.count_post()) {
                this.articles.push(this.getBlogArticles(dashParse));
            }
            this.disableMoreLoad = false;
            this.setState({ rendernize: true });
        });

        ipcRenderer.on('authorizeFailed', (_: {}, err: DnsError) => {
            this.is_authorized = true;
            this.ErrorStatus = err;
            this.menuStatus = undefined;
            this.disableMoreLoad = false;
            this.setState({ rendernize: true });
        });
    }

    private responcePosts() {
	ipcRenderer.on('DidSuccessReblog', (_:{}, _postedURI: string) => {

	});
	ipcRenderer.on('DidFailReblog', (_:{}, _err: Error) => {
	
	});
    }

    private keyInput() {
        document.addEventListener('keydown', (event: HTMLElementEvent<HTMLInputElement>) => {
            switch (this.menuStatus) {
                case menu[0]:
                case menu[1]: {
                    switch (detectKey(event)) {
                        case 'J': {
                            ++this.nowSelectedPostID;
                            if (this.hasDataSize + 1 <= this.nowSelectedPostID) {
                                document.getElementById('panel').scroll({ top: document.getElementById('panel').scrollHeight, behavior: 'smooth' });
                            } else {
                                document.getElementById(this.postIDPrefix + this.nowSelectedPostID.toString()).scrollIntoView({ behavior: 'smooth' });
                            }
                            break;
                        }
                        case 'K': {
                            if (this.nowSelectedPostID > 1) {
                                this.nowSelectedPostID -= 1;
                                document.getElementById(this.postIDPrefix + this.nowSelectedPostID.toString()).scrollIntoView({ behavior: 'smooth' });
                            }
                            break;
                        }
                        default: {
                            // TODO: catch another input
                        }
                    }
                    break;
                }
                default: {
                    switch (detectKey(event)) {
                        case 'Ctrl+Q': {
                            ipcRenderer.send('clicked_quit');
                            break;
                        }
                        default: {
                            // TODO: catch another input
                        }
                    }
                }
            }
        });
    }

    private gotEmpty() {
        this.clear();

        if (this.ErrorStatus === undefined) {
            return (
                <main id='panel'>
                    <div className='centernize'>
                        <p id='noPosts'>
                            {React.createElement(require('react-icons/lib/md/no-sim'), { size: 90 })}
                            <span className={['br', 'noPostsMes'].join(' ')}>No posts to display.</span>
                        </p>
                    </div>
                </main>
            );
        } else {
            let errorMessage: string[] = dnsError(this.ErrorStatus.code);
            return (
                <main id='panel'>
                    <div className='centernize'>
                        <p id='noPosts'>
                            {React.createElement(require('react-icons/lib/md/no-sim'), { size: 90 })}
                            {
                                errorMessage.map((err: string) => {
                                    return <span key={err} className={['br', 'noPostsMes'].join(' ')}>{err}</span>;
                                })
                            }
                        </p>
                    </div>
                </main>
            );
        }
    }

    private sidebar_button_events() {
        ipcRenderer.on('reloaded_data', (_: {}, Item: string, tmbr: tumblr.DashboardResponse.basic, limit: number) => {
            this.clear();

            switch (Item) {
                case menu[0]: {
                    this.menuStatus = menu[0];
                    const dashParser = new TmbrDashboardParse(tmbr, limit);
                    if (dashParser.count_post()) {
                        this.articles.push(this.getBlogArticles(dashParser));
                    }
                    this.setState({ rendernize: true });
                    break;
                }
                case menu[1]: {
                    this.menuStatus = menu[1];
                    const likesParser = new TmbrLikesParse(tmbr, limit);
                    if (likesParser.count_post()) {
                        this.articles.push(this.getBlogArticles(likesParser));
                    }
                    this.setState({ rendernize: true });
                    break;
                }
                default: {

                    // TODO: other sidebar reloaded
                }
            }
        });

        ipcRenderer.on('disp_info', (_: {}) => {
            // TODO: disp info
        });
    }

    private change_column_events() {
        ipcRenderer.on(menu[0], (_: {}, tmbr: tumblr.DashboardResponse.basic, limit: number) => {
            this.clear();
            this.menuStatus = menu[0];
            this.disableMoreLoad = true;
            this.nowSelectedPostID = 0;
            this.postCount = 0;

            const dashParser = new TmbrDashboardParse(tmbr, limit);

            if (dashParser.count_post()) {
                this.articles.push(this.getBlogArticles(dashParser));
            }
            this.disableMoreLoad = false;
            this.setState({ rendernize: true });
        });

        ipcRenderer.on(menu[1], (_: {}, tmbr: tumblr.DashboardResponse.basic, limit: number) => {
            this.clear();
            this.menuStatus = menu[1];
            this.disableMoreLoad = true;
            this.nowSelectedPostID = 0;
            this.postCount = 0;

            const likesParser = new TmbrLikesParse(tmbr, limit);

            if (likesParser.count_post()) {
                this.articles.push(this.getBlogArticles(likesParser));
            }

            this.disableMoreLoad = false;
            this.setState({ rendernize: true });
        });

        ipcRenderer.on(menu[2], (_: {}, tmbr: tumblr.UserInfo.UserInfo, __: number) => {
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
        const prefix = '_moreLoaded';

        ipcRenderer.on(menu[0] + prefix, (_: {}, tmbr: tumblr.DashboardResponse.basic, limit: number) => {
            if (!this.disableMoreLoad) {
                this.disableMoreLoad = true;
                this.menuStatus = menu[0];
                const dashParser = new TmbrDashboardParse(tmbr, limit);

                if (dashParser.count_post()) {
                    this.articles.push(this.getBlogArticles(dashParser));
                }
                this.disableMoreLoad = false;
                this.setState({ rendernize: true });
            }
        });

        ipcRenderer.on(menu[1] + prefix, (_: {}, tmbr: tumblr.DashboardResponse.basic, limit: number) => {
            if (!this.disableMoreLoad) {
                this.disableMoreLoad = true;
                this.menuStatus = menu[1];
                const likesParser = new TmbrLikesParse(tmbr, limit);

                if (likesParser.count_post()) {
                    this.articles.push(this.getBlogArticles(likesParser));
                }
                this.disableMoreLoad = false;
                this.setState({ rendernize: true });
            }
        });

        // TODO: other change more loading event
    }

    private getBlogArticles(tmbrParse: TmbrDashboardParse | TmbrLikesParse) {
        let bodyInfo: [string, string | tumblr.ImageProper, string][] = [];
        let postReblogInfo: [boolean, string, tumblr.reblogRequests][] = [];

        this.hasDataSize += tmbrParse.count_post();

        for (let i = 0; i < tmbrParse.count_post(); ++i) {
            switch (tmbrParse.postType(i)) {
                case postTypes.photo: {
                    bodyInfo.push([tmbrParse.postType(i), tmbrParse.original_image(i), tmbrParse.caption(i)]);
                    postReblogInfo.push([tmbrParse.can_reblog(i), tmbrParse.blogName(i), { id: tmbrParse.id(i), reblog_key: tmbrParse.reblog_key(i) }]);
                    break;
                }
                case postTypes.text: {
                    bodyInfo.push([tmbrParse.postType(i), this.removeTag(tmbrParse.body(i)), tmbrParse.title(i)]);
                    postReblogInfo.push([tmbrParse.can_reblog(i), tmbrParse.blogName(i), { id: tmbrParse.id(i), reblog_key: tmbrParse.reblog_key(i) }]);
                    break;
                }
                case postTypes.quote: {
                    bodyInfo.push([tmbrParse.postType(i), tmbrParse.text(i), tmbrParse.source(i)]);
                    postReblogInfo.push([tmbrParse.can_reblog(i), tmbrParse.blogName(i), { id: tmbrParse.id(i), reblog_key: tmbrParse.reblog_key(i) }]);
                    break;
                }
                case postTypes.link: {
                    // TODO: link
                    break;
                }
                case postTypes.chat: {
                    // TODO: chat
                    break;
                }
                case postTypes.audio: {
                    // TODO: audio
                    break;
                }
                case postTypes.video: {
                    // TODO: video
                    break;
                }
                default: {
                    // TODO: catch
                }
            }
        }

        let counter = 0;
        const classes = ['hoverActionPhoto', 'aarticle'].join(' ');

        return (
            <div>
                {
                    bodyInfo.map((item: [string, tumblr.ImageProper, string]) => {

                        switch (item[0]) {
                            case postTypes.photo: {
                                ++this.postCount;
                                ++counter;
                                return (
                                    <figure className={classes} id={this.postIDPrefix + this.postCount.toString()}>
                                        <img className='dashPhoto' src={item[1].url} />
                                        <figcaption>
                                            <h3>hogehoge</h3>
                                            <p>{this.removeTag(item[2])}</p>
                                        </figcaption>
                                        <GnavButton canReblog={postReblogInfo[counter - 1][0]} blogIdentifier={postReblogInfo[counter - 1][1]} params={postReblogInfo[counter - 1][2]} />
                                    </figure>
                                );
                            }
                            case postTypes.text: {
                                ++this.postCount;
                                ++counter;
                                return (
                                    <figure className={classes} id={this.postIDPrefix + this.postCount.toString()}>
                                        <div className='textPhoto'>
                                            <h3>{item[2]}</h3>
                                            <p>{item[1]}</p>
                                        </div>
                                        <figcaption>
                                            <p>this is test</p>
                                        </figcaption>
                                        <GnavButton canReblog={postReblogInfo[counter - 1][0]} blogIdentifier={postReblogInfo[counter - 1][1]} params={postReblogInfo[counter - 1][2]} />
                                    </figure>
                                );
                            }
                            case postTypes.quote: {
                                ++this.postCount;
                                ++counter;
                                return (
                                    <figure className={classes} id={this.postIDPrefix + this.postCount.toString()}>
                                        <div className='textPhoto'>
                                            <h3>{item[1]}</h3>
                                            <p>{item[2]}</p>
                                        </div>
                                        <GnavButton canReblog={postReblogInfo[counter - 1][0]} blogIdentifier={postReblogInfo[counter - 1][1]} params={postReblogInfo[counter - 1][2]} />
                                        <figcaption>
                                            <p>this is test</p>
                                        </figcaption>
                                    </figure>
                                );
                            }
                            case postTypes.quote: {
                                break;
                            }
                            case postTypes.link: {
                                break;
                            }
                            case postTypes.chat: {
                                break;
                            }
                            case postTypes.audio: {
                                break;
                            }
                            case postTypes.video: {
                                break;
                            }
                            default: {
                                break;
                            }
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
        const masonryOption = {
            itemSelector: '.aarticle',
            columnWidth: 0,
            gutter: 10,
            fitWidth: true,
            horizontalOrder: true,
            transitionDuration: '1.2s',
            initLayout: true
        };

        switch (this.menuStatus) {
            case menu[0]: {
                return (
                    <Masonry className='articleWrapper' options={masonryOption}>
                        {this.articles.map((item: JSX.Element) => item)}
                    </Masonry>
                );
            }
            case menu[1]: { // Likes
                return (
                    <Masonry className='articleWrapper' options={masonryOption}>
                        {this.articles.map((item: JSX.Element) => item)}
                    </Masonry>
                );
            }
            case menu[2]: { // Follows
                return (
                    <div>
                        <h2>{menu[2]}</h2>
                        {this.articles}
                    </div>
                );
            }
            case menu[3]: { // MyBlogs
                return (
                    <div>
                        <h2>MyBlogs Section</h2>
                        <p>{this.articles}</p>
                    </div>
                );
            }
            case menu[4]: { // Popular
                return (
                    <div>
                        <h2>Popular Section</h2>
                        <p>{this.articles}</p>
                    </div>
                );
            }
            case menu[5]: { // Settings
                return (
                    <div>
                        <h2>Settings Section</h2>
                        <p>{this.articles}</p>
                    </div>
                );
            }
            case menu[6]: { // About
                return (
                    <div>
                        <h2>About Section</h2>
                        <p>{this.articles}</p>
                    </div>
                );
            }
            default: {
                return <div><h2>Section</h2><p>Loading Error</p></div>;
            }
        }
    }

    private displayMain() {
        return this.is_authorized ? this.loaded() : this.loading();
    }

    private loadMore() {
        ipcRenderer.send(this.menuStatus + '_more');
    }

    private render_impl() {
        const visible = (isVisible: boolean) => { if (isVisible && (!this.disableMoreLoad)) { this.loadMore(); } };

        return (
            <main id='panel'>
                <section>
                    {this.displayMain()}
                </section>
                <div className='centernize'>
                    <Loader type='square-spin' />
                    <VisibilitySensor onChange={visible} />
                </div>
            </main>
        );
    }
}
