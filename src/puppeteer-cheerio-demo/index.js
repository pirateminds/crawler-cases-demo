import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const options = {
  uri: `http://books.toscrape.com/`,
  transform: (body) => cheerio.load(body)
};

const scrape = async (options) => {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(options.uri);
    let content = await page.content();
    let $ = options.transform(content);
    browser.close();
    return $;
};

export default (params)=> scrape({...options, ...params });
