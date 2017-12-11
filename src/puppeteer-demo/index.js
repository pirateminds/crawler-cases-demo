import puppeteer from 'puppeteer';

const scrape = async() => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1240,
        height: 680
    });
    await page.goto('https://google.com');
    await page.screenshot({
        path: 'google.png'
    });
    await browser.close();
}

export default () => scrape();
