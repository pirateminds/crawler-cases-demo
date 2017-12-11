import scrape from './index';
import now from 'performance-now';
import { mapSeries } from 'p-iteration';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

const getPerformace = async (fn)=> {
    let start = now()
    let result = await fn();
    return { result, speed: now() - start};
}

describe('puppeteer should work with request js', () => {
    test('the code should detect dynamic pages, the cost should be permanent', async () => {
        let urls = [
            { uri: "https://ab.onliner.by/" },
            { uri: 'https://ab.onliner.by/' },
            { uri: 'https://ab.onliner.by/', isDynamic: true  },
        ];

        let otherResults = await mapSeries(urls, async (e)=> {
            return await getPerformace(()=> scrape(e));
        });

        console.log(otherResults.map(e => e.speed));

        otherResults.map(e=> e.speed - otherResults[0].speed).forEach(e=> {
            expect(e).toBeLessThanOrEqual(1500);
        });

        otherResults.map(e=> e.result).forEach(result=> {
            expect(result.length).toBeGreaterThanOrEqual(1);
        });
    });

    test('static sites shoud be superfast', async () => {
        let urls = [
            { uri: "https://ab.onliner.by/", selector: '.project-navigation__sign' },
            { uri: 'https://ab.onliner.by/', selector: '.project-navigation__sign' },
            { uri: 'https://ab.onliner.by/', selector: '.project-navigation__sign', isDynamic: true  },
        ];

        let otherResults = await mapSeries(urls, async (e)=> {
            return await getPerformace(()=> scrape(e));
        });

        console.log(otherResults.map(e => e.speed));

        otherResults.map(e=> e.speed - otherResults[2].speed).forEach(e=> {
            expect(e).toBeLessThanOrEqual(5000);
        });

        otherResults.map(e=> e.result).forEach(result=> {
            expect(result.length).toBeGreaterThanOrEqual(1);
        });
    });
});
