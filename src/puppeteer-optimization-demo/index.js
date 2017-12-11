import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { clearTimeout } from 'timers';

const options = {
    launch: { headless: true },
    setViewport: { width: 1240, height: 680 },
    transform: (body) => cheerio.load(body)
};

let browser = null;
let browserTimeout = null;

const createBrowser = async ({launch})=> {
    clearTimeout(browserTimeout);
    if (!browser) {
        browser = await puppeteer.launch(launch);
    }

    return browser;
}

const closeBrowser = ()=> {
    clearTimeout(browserTimeout);
    browserTimeout = setTimeout(() => {
        browser.close();
        browser = null;
    }, 15000);
}

const scrape = async (options) => {
    const browser = await createBrowser(options);
    const page = await browser.newPage();

    await page.setViewport(options.setViewport);
    await page.goto(options.uri, {waitUntil: ['domcontentloaded']});

    let content = await page.content();
    let $ = options.transform(content);

    await page.close();
    closeBrowser();
    return $;
    // make something awesome here
};

export default (params)=> scrape({...options, ...params });
