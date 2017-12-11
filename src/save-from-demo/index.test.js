import scrape from './index';

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

describe('test savefrom.ru', () => {
    test('try to receive direct path easyway', async () => {
        let directUrl = await scrape('https://www.youtube.com/watch?v=z4BK4qVHWW8');
        console.log(directUrl);
        expect(typeof directUrl).toBe("string");
    });

    test('try to receive direct path with old callback way', (done) => {
        scrape('https://www.youtube.com/watch?v=z4BK4qVHWW8', function(directUrl) {
            expect(typeof directUrl).toBe("string");
            done();
        });
    });
});
