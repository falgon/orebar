export const menu: string[] = [
    'Dashboard', 'Likes', 'Follows', 'MyBlogs', 'Popular', 'Settings', 'About'
];

interface postTypesInterface {
    photo: string;
    text: string;
    quote: string;
    link: string;
    chat: string;
    audio: string;
    video: string;
}

export const postTypes: postTypesInterface  = { 
    photo: 'photo', 
    text: 'text', 
    quote: 'quote', 
    link: 'link', 
    chat: 'chat', 
    audio: 'audio', 
    video: 'video' 
};
