import $ from './index';
import cheerio from 'cheerio';

describe('cheerio demo', () => {
    test('should be cheerio', () => {
        return expect(typeof $).toEqual(typeof cheerio);
    });

    test('#cities .small should be Salem', () => {
            return expect($('#cities').find('.small').text()).toBe("Salem");
    });

    test('#towns .small should be Madras', () => {
        return expect($('#towns').find('.small').text() ).toBe("Madras");
    });

    test('all .small should be "Salem, Madras"', () => {
        return expect($('.small').map((index, el)=> $(el).text()).get().join(', ')).toBe("Salem, Madras");
    });
});
