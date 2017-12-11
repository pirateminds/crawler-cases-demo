import cheerio from 'cheerio';
import { URL } from 'url';
import requestDriver from './request-driver';
import puppeteerDriver from './puppeteer-driver';

const options = {
    uri: 'https://ab.onliner.by/',
    selector: '.autoba-table-imp h2 strong',
    launch: { headless: true },
    blacklist: [
        /.*css/,
        /.*google.*/
    ],
    setViewport: { width: 1240, height: 680 },
    setCookie: {
        name: "li_at",
        value: "10",
        domain: "www.linkedin.com"
    },
    isDynamic: false,
    transform: (body) => cheerio.load(body)
};

const isDynamicUrls = new Map();

const scrape = async (options) => {
    let origin = (new URL(options.uri)).origin;
    let $ = null;
    if (options.isDynamic) {
        isDynamicUrls.set(origin, true);
    }

    if (!isDynamicUrls.has(origin)) {
        $ = await requestDriver(options);
        let items = $(options.selector);
        if (items.length) {
            return items.map(function() {return $(this).text();}).get();
        }

        isDynamicUrls.set(origin, true);
    }

    $ = await puppeteerDriver(options);
    return $(options.selector).map(function() {return $(this).text();}).get();
};

export default (params)=> scrape({...options, ...params });
