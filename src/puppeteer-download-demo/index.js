import puppeteer from 'puppeteer';
import fs from 'fs';

const options = {
    launch: { headless: false },
    setViewport: { width: 1240, height: 680 },
    uri: 'https://disk.yandex.ru/download/#pc',
    file: {
        regexp: /\.svg/,
        path: './assets/download/test.svg',
        selector: '.button-group__main-button.get__link.get__link_os_mac-os'
    }
};

const writeFileInterceptor = ({file})=> (e) => {
    if (file.regexp.test(e.url)) {
        e.buffer().then(buffer => {
            fs.writeFileSync(file.path, Buffer.from(buffer, 'base64'));
        });
    }
}

const scrape = async(options) => {
    let browser = await puppeteer.launch(options.launch);
    let page = await browser.newPage();
    await page.goto(options.uri, {waitUntil: ['domcontentloaded']});

    await page.setRequestInterception(true);
    page.on('response', writeFileInterceptor(options));
    await page.click(options.file.selector, {waitUntil: ['domcontentloaded']});

    return browser.close();;
};

export default (params)=> scrape({...options, ...params });
