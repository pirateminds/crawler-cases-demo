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
    page.on('request', writeFileInterceptor(options));
    //"a session cookie value copied from your DevTools",
    options.setCookie.value = options.cookie || options.setCookie.value;
    await page.setCookie(options.setCookie);
    await page.goto(options.uri, {waitUntil: ['networkidle0']});

    let content = await page.content();
    let $ = options.transform(content);

    await page.close();
    await browser.close();

    return $;
};
