import scrape from './index';
import fs from 'fs';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

describe('puppeteer download file using request interceptor', () => {
    test('try download yandex disk', () => {
        let options = {
            launch: { headless: true },
            setViewport: { width: 1240, height: 680 },
            uri: 'https://disk.yandex.ru/download/#pc',
            file: {
                regexp: /\.svg/,
                path: './assets/download/test.svg',
                selector: '.button-group__main-button.get__link.get__link_os_mac-os'
            }
        };

        const scrape = require('./index').default;
        return scrape(options).then(() => {
            return expect(fs.existsSync(options.file.path)).toBe(true);
        });
    });
});
