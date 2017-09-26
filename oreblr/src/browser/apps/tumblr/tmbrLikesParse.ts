/// <refernce path='./tumblr.d.ts' />

export class tmbrLikesParse {
    constructor(private postData: any, private limit: number) { }

    get readLimit(): number {
        return this.limit;
    }
    public count_post(): number {
        return this.postData.liked_count;
    }
    public title(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).title;
    }
    public body(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).body;
    }
    public postType(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).type;
    }
    public blogName(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).blog_name;
    }
    public id(entryNum: number): number {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).id;
    }
    public post_url(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).post_url;
    }
    public slug(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).slug;
    }
    public date(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).date;
    }
    public timestamp(entryNum: number): number {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).timestamp;
    }
    public state(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).state;
    }
    public format(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).format;
    }
    public reblog_key(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).reblog_key;
    }
    public tags(entryNum: number): string[] {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).tags;
    }
    public short_url(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).short_url;
    }
    public summary(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).summary;
    }
    public is_blocks_post_format(entryNum: number): boolean {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).is_blocks_post_format;
    }
    public recommended_source(entryNum: number): {} {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).recommended_source;
    }
    public recommended_color(entryNum: number): {} {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).recommended_color;
    }
    public followed(entryNum: number): boolean {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).followed;
    }
    public liked(entryNum: number): boolean {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).liked;
    }
    public note_count(entryNum: number): number {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).note_count;
    }
    public caption(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).caption;
    }
    public reblog(entryNum: number): tumblr.DashboardResponse.Reblog {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).reblog;
    }
    public trail(entryNum: number): tumblr.DashboardResponse.trailElements.Trail {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).trail;
    }
    public image_permalink(entryNum: number): string {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).image_permalink;
    }
    public photos(entryNum: number) {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).photos;
    }
    public can_like(entryNum: number): boolean {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).can_like;
    }
    public can_reblog(entryNum: number): boolean {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).can_reblog;
    }
    public can_send_in_message(entryNum: number): boolean {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).can_send_in_message;
    }
    public can_reply(entryNum: number): boolean {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).can_reply;
    }
    public display_avatar(entryNum: number): boolean {
        return this.limitCheck(entryNum) ? undefined : this.at(entryNum).display_avatar;
    }
    public original_image(entryNum: number): tumblr.ImageProper {
        return this.limitCheck(entryNum) ? undefined :
            {
                url: this.photos(entryNum)[0].original_size.url,
                width: this.photos(entryNum)[0].original_size.width,
                height: this.photos(entryNum)[0].original_size.width
            };
    }
    private limitCheck(n: number): boolean {
        return n >= this.limit;
    }
    private at(index: number) {
        return this.postData.liked_posts[index];
    }
}
