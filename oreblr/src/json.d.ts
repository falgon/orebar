interface jsonScripts {
    build: string;
    build_release: string;
    asar: string;
    test: string;
    tsc: string;
    tscwatch: string;
    webpackwatch: string;
    clean: string;
    start: string;
}

interface jsonRepository {
    type: string;
    url: string;
}

interface jsonBugs {
    url: string;
}

declare module '*.json' {
    const name: string;
    const productName: string;
    const description: string;
    const main: string;
    const scripts: jsonScripts;
    const author: string;
    const lisence: string;
    const repository: jsonRepository;
    const keywords: string[];
    const bugs: jsonBugs;
}
