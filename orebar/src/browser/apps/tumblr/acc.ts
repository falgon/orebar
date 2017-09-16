// dirty typescript because tumblr.js is not supported @types ...

import * as express from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as ExistFile from '../../utility/isexist.js';
import * as tumblr_cli from './tmbrget.js';
import opener = require('opener');

const oauth = require('oauth');
const path = require('path');

const CONSUMER_KEY: string = 'WJbL4DpsB167XaNdeCOQx3TWLsxKJreORvWXEYrBufByLODynM';
const CONSUMER_SECRET: string = 'FFNVTRT1xc0vuCr103mjHxkFs0qCnqYEaMUr67lVtf6nRhoRtg';

let tumblrOauthAccessToken: string,
    tumblrOauthAccessTokenSecret: string,
    oauthRequestToken: any = undefined,
    oauthRequestTokenSecret: any = undefined;

function getAccessToken(tokens: string, callback:(tumblrcli:any) => void) {
    let app = express();
    app.set('port', process.env.PORT || 3000);

    let consumer: any = new oauth.OAuth(
        "http://www.tumblr.com/oauth/request_token",
        "http://www.tumblr.com/oauth/access_token",
        CONSUMER_KEY,
        CONSUMER_SECRET,
        "1.0A",
        "http://localhost:3000/auth/callback",
        "HMAC-SHA1"
    );

    app.get('/', function(_: any, res: any) {
        consumer.getOAuthRequestToken(function(error: boolean, oauthToken: any, oauthTokenSecret: any):any {
            if (error) {
		res.send("Error getting OAuth request token: " + error, 500);
		return undefined;
            } else {
                oauthRequestToken = oauthToken,
                oauthRequestTokenSecret = oauthTokenSecret;

		res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauthRequestToken);
            }
        });
    });

    
    const server = http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
	opener("http://localhost:3000");
    });
    server.on('connection',function(socket:any){ socket.unref(); }); 

    app.get('/auth/callback', function(req: any, res: any):any {
        consumer.getOAuthAccessToken(
            oauthRequestToken,
            oauthRequestTokenSecret,
            req.query.oauth_verifier,
            function(error: boolean, _oauthAccessToken: any, _oauthAccessTokenSecret: any):any {
                if (error) {
		    res.send("Error getting OAuth access token: " + error, 500);
		    return undefined;
                } else {
                    tumblrOauthAccessToken = _oauthAccessToken;
                    tumblrOauthAccessTokenSecret = _oauthAccessTokenSecret;
                    const oauth:any[] = [
                        CONSUMER_KEY,
                        CONSUMER_SECRET,
                        tumblrOauthAccessToken,
                        tumblrOauthAccessTokenSecret
		    ];

		    fs.writeFile(__dirname + '/' + tokens, tumblrOauthAccessToken + '\n' + tumblrOauthAccessTokenSecret, function(err) {
                        if (err) throw err;
			console.log("save complete");
		    });
		    res.sendFile(path.resolve(__dirname + '/../../../../../docs/tumblrAS.html'));
		    callback(new tumblr_cli.tumblrCli(oauth));
                }
            });
    });
}

export function login(callback: (tumblrcli: any) => void) {
    const tokens: string = 'tokens';

    if (ExistFile.isExistFile(__dirname + '/' + tokens)) {
	const splitToken: string[] = fs.readFileSync(__dirname + '/' + tokens).toString().split(/\r\n|\r|\n/);;

        if (splitToken[0] != "" && splitToken[1] != "") {
            tumblrOauthAccessToken = splitToken[0];
            tumblrOauthAccessTokenSecret = splitToken[1];
            callback(new tumblr_cli.tumblrCli([
		CONSUMER_KEY,
                CONSUMER_SECRET,
                tumblrOauthAccessToken,
                tumblrOauthAccessTokenSecret
	    ])
	    );
        }
    } else {
	getAccessToken(tokens,callback);
    }
}
