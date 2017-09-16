const tumblr = require('tumblr.js');

export class tumblrCli {
    private client: any = undefined;

    constructor(oauth: any,private read_limit: number = 20,private read_pos: number = 0) {
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
	let result:string[] = [];
	p.user.blogs.forEach((blog:any) => result.push(blog.name));
	return result;
    }

    public getDashboardLatest() {
	return this.client.userDashboard({ limit: this.read_limit }, function(err: any, _: any): void {
            if (!err) this.read_pos = this.read_limit;
	}.bind(this));
    }

    public getDashboard(off: number, t: string = undefined) {
        let params: Object = undefined;

        if (t === undefined) {
            params = { offset: off };
        } else {
            params = { offset: off, type: t };
        }

        return this.client.userDashboard(params, function(err: any, _: any): void {
            if (!err) this.read_pos += this.read_limit;
        }.bind(this));
    }

    public getDashboardNext(readSize: number = this.read_limit) {
	return this.client.userDashboard({ offset: this.read_pos, limits: readSize }, function(err: any, _: any): void {
	    if (!err) this.read_pos += readSize;
        }.bind(this));
    }

    get readPos(): number {
        return this.read_pos;
    }
    get readLimit(): number {
        return this.read_limit;
    }

    set readLimit(limit: number) {
	this.read_limit = limit;
    }
}
