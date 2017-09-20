export function makeKeyFromHTMLPath(uri: string) {
    let counter: number = 0, j: number = 0;

    for(let i = uri.length - 1; i >= 0; --i) {
	if(j === 2) break;
	if(uri[i] === '/') ++j;
	++counter;
    }
    if(j <= 1) {
	return null;
    }

    return uri.slice(uri.length - counter);
}
