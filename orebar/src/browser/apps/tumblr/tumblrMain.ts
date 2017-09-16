import * as access from './acc.js';

async function Callback(tumblrcli:any) {
    if(tumblrcli === undefined) return;

    /*let p1 = */await tumblrcli.getUserBlog();
    /*let p2 = */await tumblrcli.getDashboardLatest();

    console.log(tumblrcli.readPos);

    /*let p3 = */await tumblrcli.getDashboardNext(1);

    console.log(tumblrcli.readPos);

    /*    console.log(p1);
    console.log(p2);
    console.log(tumblrcli.readPos);*/
}

function tumblrMain() : void {
    access.login(Callback);
}

tumblrMain();
