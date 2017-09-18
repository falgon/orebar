const Viewmodule = require('./view.js');
const Pack = require('../../../package.json');
import * as express from 'express';
import * as fs from 'fs';
import * as ExistFile from '../utility/isexist';
import * as http from 'http';
import * as tumblrCli from '../apps/tumblr/tmbrget';
import opener = require('opener');

let tumblrData: any = undefined;

const CONSUMER_KEY: string = 'WJbL4DpsB167XaNdeCOQx3TWLsxKJreORvWXEYrBufByLODynM';
const CONSUMER_SECRET: string = 'FFNVTRT1xc0vuCr103mjHxkFs0qCnqYEaMUr67lVtf6nRhoRtg';
const TOKENS_FILE: string = 'tokens';

function getAccessToken(event: any) {
    let app = express();
    let oauthRequestToken: any = undefined, oauthRequestTokenSecret: any = undefined;

    app.set('port', process.env.PORT || 3000);

    const oauth = require('oauth');
    let consumer: any = new oauth.OAuth(
        "http://www.tumblr.com/oauth/request_token",
        "http://www.tumblr.com/oauth/access_token",
        CONSUMER_KEY,
        CONSUMER_SECRET,
        "1.0A",
        "http://localhost:3000/auth/callback",
        "HMAC-SHA1"
    );

    app.get('/', (_: any, res: any) => {
        consumer.getOAuthRequestToken((error: boolean, oauthToken: any, oauthTokenSecret: any) => {
            if (error) {
                res.send("Error getting OAuth request token: " + error, 500);
                return;
            } else {
                oauthRequestToken = oauthToken;
                oauthRequestTokenSecret = oauthTokenSecret;

                res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauthRequestToken);
            }
        });
    });

    const server = http.createServer(app).listen(app.get('port'), () => {
        console.log('Listening on port ' + app.get('port'));
        opener('http://localhost:3000');
    });
    server.on('connection', (sock: any) => { sock.unref(); });


    app.get('/auth/callback', (req: any, res: any) => {
        consumer.getOAuthAccessToken(
            oauthRequestToken,
            oauthRequestTokenSecret,
            req.query.oauth_verifier,
            async function (error: boolean, AccessToken: any, AccessTokenSecret: any) {
                if (error) {
                    res.send("Error getting OAuth access token: " + error, 500);
                    return;
                } else {
                    const oauth: any[] = [
                        CONSUMER_KEY,
                        CONSUMER_SECRET,
                        AccessToken,
                        AccessTokenSecret
                    ];

                    fs.writeFile(__dirname + '/' + TOKENS_FILE, AccessToken + '\n' + AccessTokenSecret, (err: any) => {
                        if (err) throw err;
                        console.log(Pack['name'] + ": Save complete");
                    });
		    res.sendFile(require('path').resolve(__dirname + '/../../render/docs/tumblrAS.html'));
		    const tumblr = new tumblrCli.tumblrCli(oauth);
		    tumblrData = tumblr;
		    event.sender.send('authorizeComplete',await tumblr.getDashboardLatest(), tumblr.readLimit);
		    console.log(Pack['name'] + ': Authorize succeed');
                }
            }
        );
    });
}

async function login(event: any) {
    if (ExistFile.isExistFile(__dirname + '/' + TOKENS_FILE)) {
	console.log(Pack['name'] + ': Found AccessToken...');
        const splitToken: string[] = fs.readFileSync(__dirname + '/' + TOKENS_FILE).toString().split(/\r\n|\r|\n/);;

	if (splitToken[0] != "" && splitToken[1] != "") {
	    console.log(Pack['name'] + ': Authorize...');
	    const tumblr = new tumblrCli.tumblrCli([CONSUMER_KEY, CONSUMER_SECRET, splitToken[0], splitToken[1]]);
	    tumblrData = tumblr;
	    event.sender.send('authorizeComplete', await tumblr.getDashboardLatest(), tumblr.readLimit);
	    console.log(Pack['name'] + ': Authorize succeed');
	} else {
	    console.log(Pack['name'] + ': ill-formed, getting access token...');
	    getAccessToken(event);
	}
    } else {
	console.log(Pack['name'] + ': Not Found AccessToken, create new access token...');
        getAccessToken(event);
    }
}

export function browser_main(): void {
    let view = new Viewmodule.Page(__dirname + '/../../render/docs/dash.html');

    view.mb.on('ready', function(): void {
        console.log(Pack['name'] + ': Ready');
    });

    view.ipcMain.on('clicked_quit', () => {
        console.log(Pack['name'] + ': Bye!');
        view.mb.app.quit();
    });

    view.ipcMain.on('tumblrAuthorization', login);
}
