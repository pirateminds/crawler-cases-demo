import scrape from './index';
import config from '../config';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;
describe('puppeteer login github', () => {
    test('should return array', async () => {
        let users = await scrape({
            username: config.github.username,
            password: config.github.password,
            search: "bitcoin",
            maxPage: 20
        });

        const resp = {
            username: expect.stringMatching(/.*/),
            email: expect.stringMatching(/@/),
        };

        expect(Array.isArray(users)).toBe(true)
        expect(users.length).toBeGreaterThan(0);

        console.log(users);
        return expect(users[0]).toMatchObject(resp);
    });
});
