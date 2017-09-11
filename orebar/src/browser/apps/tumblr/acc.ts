import * as express from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as ExistFile from '../../utility/isexist.js';
import * as tumblr_cli from './tmbrget.js';
const oauth = require('oauth');

const CONSUMER_KEY: string = 'WJbL4DpsB167XaNdeCOQx3TWLsxKJreORvWXEYrBufByLODynM';
const CONSUMER_SECRET: string = 'FFNVTRT1xc0vuCr103mjHxkFs0qCnqYEaMUr67lVtf6nRhoRtg';

var tumblrOauthAccessToken: string,
    tumblrOauthAccessTokenSecret: string,
    oauthRequestToken: any = undefined,
    oauthRequestTokenSecret: any = undefined;

function getAccessToken(tokens: string) {
    var app = express();
    app.set('port', process.env.PORT || 3000);

    var consumer: any = new oauth.OAuth(
        "http://www.tumblr.com/oauth/request_token",
        "http://www.tumblr.com/oauth/access_token",
        CONSUMER_KEY,
        CONSUMER_SECRET,
        "1.0A",
        "http://localhost:3000/auth/callback",
        "HMAC-SHA1"
    );

    app.get('/', function(_: any, res: any) {
        consumer.getOAuthRequestToken(function(error: boolean, oauthToken: any, oauthTokenSecret: any) {
            if (error) {
                res.send("Error getting OAuth request token: " + error, 500);
            } else {
                oauthRequestToken = oauthToken,
                    oauthRequestTokenSecret = oauthTokenSecret;

                res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauthRequestToken);
            }
        });
    });

    app.get('/auth/callback', function(req: any, res: any) {
        consumer.getOAuthAccessToken(
            oauthRequestToken,
            oauthRequestTokenSecret,
            req.query.oauth_verifier,
            function(error: boolean, _oauthAccessToken: any, _oauthAccessTokenSecret: any) {
                if (error) {
                    res.send("Error getting OAuth access token: " + error, 500);
                } else {
                    tumblrOauthAccessToken = _oauthAccessToken;
                    tumblrOauthAccessTokenSecret = _oauthAccessTokenSecret;
                    const oauth = {
                        consumer_key: CONSUMER_KEY,
                        consumer_secret: CONSUMER_SECRET,
                        token: tumblrOauthAccessToken,
                        token_secret: tumblrOauthAccessTokenSecret
                    };

                    fs.writeFile(tokens, tumblrOauthAccessToken + '\n' + tumblrOauthAccessTokenSecret, function(err) {
                        if (err) throw err;
                        console.log("save complete");
                    });
                    tumblr_cli.tumblrCli(oauth);
                    return;
                }
            });
    });

    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express server listening on port ' + app.get('port'));
    });
}

export function login(): void {
    const tokens: string = 'tokens';

    if (ExistFile.isExistFile(tokens)) {
        const splitToken: string[] = fs.readFileSync(tokens).toString().split(/\r\n|\r|\n/);;

        if (splitToken[0] != "" && splitToken[1] != "") {
            tumblrOauthAccessToken = splitToken[0];
            tumblrOauthAccessTokenSecret = splitToken[1];
            tumblr_cli.tumblrCli({
                consumer_key: CONSUMER_KEY,
                consumer_secret: CONSUMER_SECRET,
                token: tumblrOauthAccessToken,
                token_secret: tumblrOauthAccessTokenSecret
            });
            return;
        }
    } else {
        getAccessToken(tokens);
    }
}

login();
