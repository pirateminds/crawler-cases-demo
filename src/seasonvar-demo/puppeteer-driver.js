import puppeteer from 'puppeteer';

const writeFileInterceptor = ({blacklist})=> (e) => {
    if (blacklist.find(item => item.test(e.url))) {
        e.abort();
    } else {
        e.continue();
    }
};

export default async (options) => {
    const browser = await puppeteer.launch(options.launch);
    const page = await browser.newPage();

    await page.setViewport(options.setViewport);
    await page.setRequestInterception(true);

    let interceptor = options.requestInterceptor ?
        options.requestInterceptor(options) :
        writeFileInterceptor(options);

    page.on('request', interceptor);

    //"a session cookie value copied from your DevTools",
    if (options.setExtraHTTPHeaders) {
        await page.setExtraHTTPHeaders(options.setExtraHTTPHeaders);
    }
    await page.goto(options.uri, {waitUntil: ['networkidle0']});

    if (options.pageHandler) {
        await options.pageHandler(options)(page);
    }
    let content = await page.content();
    let $ = options.transform(content);

    await page.close();
    await browser.close();

    return $;
};
