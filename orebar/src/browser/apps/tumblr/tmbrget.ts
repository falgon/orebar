#! /usr/bin/env node

export function tumblrCli(oauth: any): void {
    const tumblr = require('tumblr');

    let blog: any = new tumblr.Blog('0x35.tumblr.com', oauth);
    blog.text({ limit: 2 }, function(error: any, response: any) {
        if (error) {
            throw new Error(error);
        }
        console.log(response.posts);
    });

    let user: any = new tumblr.User(oauth);

    user.info(function(error: any, response: any) {
        if (error) {
            throw new Error(error);
        }
        console.log(response.user);

    });
}
