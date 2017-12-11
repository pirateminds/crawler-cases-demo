import scrape from './index';
import cheerio from 'cheerio';

// jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

describe('request with cheerio', () => {
    test('should response the cheerio', () => {
        return scrape().then($ => {
            return expect(typeof $).toEqual(typeof cheerio);
        });
    });

    test('should load static page', () => {
        return scrape({
            uri: "https://www.google.com/search?num=50&source=hp&ei=_7sQWsxIyvnAAtatovgN&q=me&oq=me&gs_l=psy-ab.3..35i39k1l2j0i67k1l3j0j0i131k1j0l3.2903.3059.0.3315.3.2.0.0.0.0.93.181.2.2.0....0...1.1.64.psy-ab..1.2.181.0...0.G5YDo4vOG8w"
        }).then($ => {
            //  cause it require dynamic js renderer
            //  return expect($('[alt="Google"]').attr("alt")).toMatch(/Google/);
            return expect($('title').text()).toMatch(/Google/);
        });
    });

    test('the page should contain elements', () => {
        return scrape({
            uri: "https://www.google.com/search?num=50&source=hp&ei=_7sQWsxIyvnAAtatovgN&q=me&oq=me&gs_l=psy-ab.3..35i39k1l2j0i67k1l3j0j0i131k1j0l3.2903.3059.0.3315.3.2.0.0.0.0.93.181.2.2.0....0...1.1.64.psy-ab..1.2.181.0...0.G5YDo4vOG8w"
        }).then($ => {
            return expect($('#ires').find('.g').length).toBeGreaterThan(0);
        });
    });
});
