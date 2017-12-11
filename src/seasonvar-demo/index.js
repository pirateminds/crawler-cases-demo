import cheerio from 'cheerio';
import { URL } from 'url';
import path from 'path';
import requestDriver from './request-driver';
import puppeteerDriver from './puppeteer-driver';
import request from 'request';
import fs from 'fs';

const options = {
    uri: 'http://seasonvar.ru/serial-17080-Grand_Tur-2-season.html',
    launch: { headless: false },
    blacklist: [],
    selector: '[itemprop="embedUrl"]',
    setViewport: { width: 1240, height: 680 },
    isDynamic: false,
    fileExtensions: [/mp4/, /flv/, /m3u8/, /m4s/],
    folder: './assets/download',
    // requestInterceptor: (e)=> {
    //     if (fileExtensions.find(e=> e.regexp.test(e.url))){
    //         e.buffer().then(buffer => {
    //             let arr = e.split('/');
    //             let fileName = arr[arr.length - 1];
    //             fs.writeFileSync(path.join(options.folder, fileName), Buffer.from(buffer, 'base64'));
    //         });
    //     }
    // },
    // pageHandler: async (page) => {
    //     await page.click('#layer')
    // },
    // formatter: ($) => {
    //     return $.attr('href');
    // },
    transform: (body) => cheerio.load(body)
};

// saving files to the downloads folder
const requestInterceptor = (options) => (e)=> {
    if (options.fileExtensions.find(ext => ext.test(e.url))) {
        console.log(e.url);
        let arr = e.url.split('/');
        let fileName = arr[arr.length - 1];

        let storedFilePath = path.join(options.folder, fileName);
        let writeStream  = fs.createWriteStream(storedFilePath);
        let stream = request(e.url).pipe(writeStream);

        stream.on('finish', function () { e.continue() });
    } else {
        e.continue();
    }
}

const responseFormatter = (options)=> ($) => {
    return $.first().attr('href');
}

const pageHandler = (options)=> async (page) => {
    await page.click('#layer');
}

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
            if (options.responseFormatter) {
                return options.responseFormatter(options)(items);
            }

            return items.map(function() {return $(this).text();}).get();
        }

        isDynamicUrls.set(origin, true);
    }

    $ = await puppeteerDriver(options);

    if (options.responseFormatter) {
        return options.responseFormatter(options)($(options.selector));
    }

    return $(options.selector).map(function() {return $(this).text();}).get();
};

const workflow = async (options) => {
    // get player url
    let playerUrl = await scrape(Object.assign({},
        options, {
            uri: 'http://seasonvar.ru/serial-17080-Grand_Tur-2-season.html',
            responseFormatter
        }));

    // get file
    return await scrape(Object.assign({},
        options, {
            uri: `http:${playerUrl}`,
            requestInterceptor,
            pageHandler
        }));
}

export default (params)=> workflow({...options, ...params });
