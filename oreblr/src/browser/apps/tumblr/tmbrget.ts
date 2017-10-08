/// <reference path='./tumblr.d.ts' />
const tumblr = require('tumblr.js');

export class tumblrCli {
    private client: tumblr.Client = undefined;

    constructor(oauth: any, private read_limit: number = 20, private read_pos: number = 0, private likes_read_pos: number = 0, private follow_read_pos: number = 0) {
        this.client = tumblr.createClient({
            consumer_key: oauth[0],
            consumer_secret: oauth[1],
            token: oauth[2],
            token_secret: oauth[3]
        });
        this.client.returnPromises();
    }

    public getUserInfo() {
        return this.client.userInfo();
    }

    public async getUserBlog() {
        let p = await this.getUserInfo();
        let result: string[] = [];
        p.user.blogs.forEach((blog: tumblr.UserInfo.detail.ResponseBlogs) => result.push(blog.name));
        return result;
    }

    public getDashboardLatest() {
        return this.client.userDashboard({ limit: this.read_limit }, (err: Error, _: string, __: string) => {
            if (!err) this.read_pos = this.read_limit;
        });
    }

    public getDashboard(off: number, t: string = undefined) {
        let params: tumblr.params = undefined;

        if (t === undefined) {
            params = { offset: off };
        } else {
            params = { offset: off, type: t };
        }

        return this.client.userDashboard(params, (err: Error, _: string, __: string) => {
            if (!err) this.read_pos += this.read_limit;
        });
    }

    public getDashboardNext(readSize: number = this.read_limit) {
        return this.client.userDashboard({ offset: this.read_pos, limit: readSize }, (err: Error, _: string, __: string) => {
            if (!err) this.read_pos += readSize;
        });
    }

    public getLikes() {
        return this.client.userLikes({ limit: this.read_limit }, (err: Error, _: string, __: string) => {
            if (!err) this.likes_read_pos = this.read_limit;
        });
    }

    public getLikesNext(readSize: number = this.read_limit) {
        return this.client.userLikes({ offset: this.likes_read_pos, limit: readSize }, (err: Error, _: string, __: string) => {
            if (!err) this.likes_read_pos += readSize;
        });
    }

    public getFollowing() {
        return this.client.userFollowing({ limit: this.read_limit }, (err: Error, _: string, __: string) => {
            if (!err) this.follow_read_pos = this.read_limit;
        });
    }

    public postReblog(blogIdentifier: string, params:tumblr.reblogRequests) {
	return this.client.reblogPost(blogIdentifier, params);
    }

    get readPos(): number {
        return this.read_pos;
    }
    get likes_readPos(): number {
        return this.likes_read_pos;
    }

    get readLimit(): number {
        return this.read_limit;
    }
    set readLimit(limit: number) {
        this.read_limit = limit;
    }
}
