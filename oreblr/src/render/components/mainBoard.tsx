import * as React from 'react';
import * as TumblrParser from '../../browser/apps/tumblr/tmbrDashboardParse';
import { ipcRenderer } from 'electron';
import { menu } from '../menu';
const Loader = require('react-loaders').Loader;
require('../docs/style/loader.scss');
require('../docs/style/dash.scss');
require('../docs/style/sidemenu.scss');

interface MainBoardStates {
    menuStatus?: string;
    is_authorized?: boolean;
}

export class MainBoard extends React.Component<any, MainBoardStates> {
    private articles: JSX.Element;

    constructor(props: any) {
        super(props);

        this.state = { menuStatus: menu[0], is_authorized: false };

        ipcRenderer.send('tumblrAuthorization');
        ipcRenderer.on('authorizeComplete', function(_: any, tmbr: any, limit: number) {
            ipcRenderer.removeAllListeners('authorizeComplete');
	    this.articles = this.getBlogArticles(tmbr, limit)
	    this.setState({ is_authorized: true });
        }.bind(this));

        for (let item of menu) {
            ipcRenderer.on(item, function (_: any, tmbr: any, limit: number) { // load another dashbord items...
		this.articles = this.getBlogArticles(tmbr, limit);
                this.setState({ menuStatus: item });
            }.bind(this));
        }
    }

    public getBlogArticles(tmbr: any, limit: any) {
        const tmbrParse = new TumblrParser.tmbrDashboardParse(tmbr, limit);

        let tmp: [string, any][] = [];
        
	for (let i = 0; i < limit; ++i) {
	    if(tmbrParse.postType(i) === 'photo') {
	    	tmp.push([tmbrParse.postType(i), tmbrParse.original_image(i)]);
	    } else if (tmbrParse.postType(i) === 'text') {
		tmp.push([tmbrParse.postType(i), tmbrParse.body(i)]);
	    } else if (tmbrParse.postType(i) === 'quote') {
	    	
	    } else if (tmbrParse.postType(i) === 'link') {
	    
	    } else if (tmbrParse.postType(i) === 'chat') {
	    
	    } else if (tmbrParse.postType(i) === 'audio') {
	    
	    } else if (tmbrParse.postType(i) === 'video') {
	    
	    }
        }

	return (
	    <div id='photos'>
	    	{
		    tmp.map((item: [string, any]) => {
	    		if(item[0] === 'photo') {
				return <img className='dashPhoto' src={item[1].url} />;
	    		} else if (item[0] === 'text') {
				return <p className='textPhoto'>{item[1]}</p>;
	    		} else if (item[0] === 'quote') {
	    		} else if (item[0] === 'link') {
	    		} else if (item[0] === 'chat') {
	    		} else if (item[0] === 'audio') {
	    		} else if (item[0] === 'video') {
			}
		    })
		}
	    </div>
	);
    }

    public componentDidMount() {
	this.articles = undefined;
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
		<div>
		    {this.articles}
		</div>
	    );
        } else if (this.state.menuStatus === menu[1]) { // Likes
            return (
                <div>
                    {this.articles}
                </div>
            );
        } else if (this.state.menuStatus === menu[2]) { // Follows
            return (
                <div>
		    <h2>{menu[2]} Section</h2>
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
