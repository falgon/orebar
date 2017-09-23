declare module tumblr {
    export interface ImageProper {
        url: string;
        width: number;
        height: number;
    }

    export type createClient = () => Client;
    export type callbackType = (_: Error, __: string, ___: string) => void;

    export interface params {
        blog_identifier?: string;
        api_key?: string;
        type?: string;
        id?: number;
        tag?: string;
        limit?: number;
        offset?: number;
        reblog_info?: boolean;
        notes_info?: boolean;
        filter?: string;
    }

    export interface Client {
        userInfo(): Promise<UserInfo.UserInfo>;
        userDashboard(_: params, __: callbackType): Promise<Object>;
	userLikes(_: params, __: callbackType): Promise<Object>;
	userFollowing(_: params, __:callbackType): Promise<Object>;
        returnPromises(): void;
    }

    module DashboardResponse {
        export interface Reblog {
            comment: string;
            tree_html: string;
        }
        module trailElements {
            export interface TrailBlog {
                name: string;
                active: boolean;
                theme: [Object];
                share_likes: boolean;
                share_following: boolean;
                can_be_followed: boolean;
            }
            export interface TrailPost {
                id: string;
            }
            export interface Trail {
                blog: TrailBlog;
                post: TrailPost;
                content_raw: string;
                content: string;
                is_root_item: boolean;
            }
        }

        module photosElements {
            export interface PhotoOriginal {
                url: string;
                width: number;
                height: number;
            }

            export interface PhotoAlt {
                url: string;
                width: number;
                height: number;
            }

            export interface Photo {
                caption: string;
                original_size: PhotoOriginal;
                alt_sizes: PhotoAlt[];
            }
        }

        export interface basic {
            type: string;
            blog_name: string;
            id: number;
            post_url: string;
            slug: string;
            date: string;
            timestamp: number;
            state: string;
            format: string;
            reblog_key: string;
            tags: string[];
            short_url: string;
            summary: string;
            is_blocks_post_format: boolean;
            recommended_source: string;
            recommended_color: string;
            followed: boolean;
            liked: boolean;
            note_count: number;
            source_url: string;
            source_titlle: string;
            caption: string;
            reblog: Reblog;
            trail: trailElements.Trail[];
            image_permalink: string;
            photos: photosElements.Photo[];
            can_like: boolean;
            can_reblog: boolean;
            can_send_in_message: boolean;
            can_reply: boolean;
            display_avatar: boolean;
            body: string;
        }
    }

    module UserFollowing {
        module detail {
            export interface ResponseBlogs {
                name: string;
                url: string;
                updated: string;
                title: string;
                description: string;
            }
        }

        export interface Response {
            total_blogs: number;
            blogs: detail.ResponseBlogs[];
        }
    }

    module UserInfo {
        module detail {
            export interface ResponseBlogs {
                name: string;
                title: string;
                url: string;
                tweet: string;
                primaty: boolean;
                followers: number;
            }
        }

        export interface Response {
            following: number;
            default_post_format: string;
            name: string;
            likes: number;
            blogs: detail.ResponseBlogs[];
        }

        export interface UserInfo {
            user: Response;
        }
    }

}
