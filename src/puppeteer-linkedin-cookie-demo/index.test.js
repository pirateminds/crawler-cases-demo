import scrape from './index';
import config from '../config';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

// describe('puppeteer linkedin cookie', () => {
//     test('should login using mine cookie', async () => {
//         let $ = await scrape({
//             uri: "https://www.linkedin.com/feed/",
//             cookie: config.linkedIn.token,
//         });

//         return expect($("[data-control-name='identity_welcome_message']").text()).toMatch(/Egor Malkevich/);
//     });
// });


describe('puppeteer github cookie', () => {
    test('should login using mine cookie', async () => {
        let $ = await scrape({
            uri: "https://github.com/search?q=bitcoin&type=Users&utf8=%E2%9C%93",
            cookie: config.github.token,
            setCookie: {
                name: "user_session",
                domain: "github.com"
            },
        });

        let nickname = $(".css-truncate-target").text();
        console.log(nickname);

        return expect(nickname).toMatch(/wegorich/);
    });
});
