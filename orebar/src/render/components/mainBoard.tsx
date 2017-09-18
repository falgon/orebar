import * as React from 'react';
import * as TumblrParser from '../../browser/apps/tumblr/tmbrDashboardParse';
import { ipcRenderer } from 'electron';

export class MainBoard extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        
	this.state = { data: this.props.defaultValue };
	ipcRenderer.send('tumblrAuthorization');
	ipcRenderer.on('authorizeComplete',(_: any, tmbr: any, limit: number) => {
	    ipcRenderer.removeAllListeners('authorizeComplete');
	    const tmbrParse = new TumblrParser.tmbrDashboardParse(tmbr,limit);

	    this.setState({ data: tmbrParse.blogName(0) });
	});
    }

    public componentDidMount() {
	console.log('waiting server...');
        this.setState({ data: 'waiting server...' });
    }

    public render() {
	console.log('rendering');
        return (
            <main id='panel'>
                <section>
                    <h2>Contents</h2>
                    <p>{this.state.data}</p>
                </section>
            </main>
        );
    }
}
