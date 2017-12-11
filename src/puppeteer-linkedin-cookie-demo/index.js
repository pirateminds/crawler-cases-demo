import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const options = {
    launch: { headless: false },
    setViewport: { width: 1240, height: 680 },
    setCookie: {
        name: "li_at",
        domain: "www.linkedin.com"
    },
    transform: (body) => cheerio.load(body)
};

const scrape = async (options) => {
    const browser = await puppeteer.launch(options.launch);
    const page = await browser.newPage();

    await page.setViewport(options.setViewport);

    //"a session cookie value copied from your DevTools",
    options.setCookie.value = options.cookie || options.setCookie.value;
    await page.setCookie(options.setCookie);
    await page.goto(options.uri, {waitUntil: ['domcontentloaded']});

    let content = await page.content();
    let $ = options.transform(content);
    browser.close();
    return $;
    // make something awesome here
};

export default (params)=> scrape({...options, ...params });
