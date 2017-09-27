const Pack = require('../../../../package.json');
import * as tumblrCli from '../../apps/tumblr/tmbrget';
import { tmbrDashboardParse } from '../../../browser/apps/tumblr/tmbrDashboardParse';
import { tmbrLikesParse } from '../../../browser/apps/tumblr/tmbrLikesParse';
import * as fs from 'fs';

const CONSUMER_KEY: string = 'WJbL4DpsB167XaNdeCOQx3TWLsxKJreORvWXEYrBufByLODynM';
const CONSUMER_SECRET: string = 'FFNVTRT1xc0vuCr103mjHxkFs0qCnqYEaMUr67lVtf6nRhoRtg';
const TOKENS_FILE: string = '../../view/tokens';

module tests {
    export async function dashboard(x: tumblrCli.tumblrCli) {
        const gotData = new tmbrDashboardParse(await x.getDashboardLatest(), x.readLimit);
        console.log(gotData.count_post());
    }

    export async function likes(x: tumblrCli.tumblrCli) {
        const gotData = new tmbrLikesParse(await x.getLikes(), x.readLimit);
        console.log(gotData);
        console.log(gotData.count_post());
    }
}

function login() {
    console.log(Pack['name'] + ': Found AccessToken...');
    const splitToken: string[] = fs.readFileSync(__dirname + '/' + TOKENS_FILE).toString().split(/\r\n|\r|\n/);;

    if (splitToken[0] != "" && splitToken[1] != "") {
        console.log(Pack['name'] + ': Authorize...');
        const tumblr = new tumblrCli.tumblrCli([CONSUMER_KEY, CONSUMER_SECRET, splitToken[0], splitToken[1]]);
        tests.dashboard(tumblr);
    }
}

login();
