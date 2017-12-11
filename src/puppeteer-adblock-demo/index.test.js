import scrape from './index';
import config from '../config';
import now from 'performance-now';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

describe('puppeteer adblock', () => {
    test('addblock should be faster', async () => {
        let options = {
            uri: "https://github.com/search?q=bitcoin&type=Users&utf8=%E2%9C%93",
            cookie: config.github.token,
            setCookie: {
                name: "user_session",
                domain: "github.com"
            },
            blacklist: [
                /.*assets-cdn\.github.*/,
                /.*githubusercontent.*/,
                /.*collector\.githubapp.*/,
                /.*fsitouchzoom\.js/,
                /.*api\.github\.com\/_private\/browser.*/,
                /.*google.*/
            ]
        };

        let start = null;

        // first item loads 100ms longer usually
        // and 1.2s longer first run

        start = now();
        await scrape(Object.assign({}, options, {blacklist: []}));
        let speedDefault = now() - start;

        start = now();
        await scrape(options);
        let speedAdBlock = now() - start;

        console.log(`AdBlocked speed - ${speedAdBlock}, by default - ${speedDefault}`);
        return expect(speedAdBlock).toBeLessThanOrEqual(speedDefault);
    });
});
