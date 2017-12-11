import scrape from './index';
import fs from 'fs';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

describe('puppeteer download video from seasonvar.ru', () => {
    test('try download file', async () => {
        let options = {
            uri: 'http://seasonvar.ru/serial-17080-Grand_Tur-2-season.html',
            launch: { headless: true },
            selector: '[itemprop="embedUrl"]',
            blacklist: [
            ],
            setViewport: { width: 1240, height: 680 },
            isDynamic: false,
            fileExtensions: [/mp4/, /flv/, /m3u8/, /m4s/],
            folder: './assets/download',
        }

        await scrape();

        let filePath = fs.readdirSync(options.folder).find(file => {
            return options.fileExtensions.find(e=> e.test(file));
        });

        return expect(filePath).not.toBeUndefined();
    });
});
