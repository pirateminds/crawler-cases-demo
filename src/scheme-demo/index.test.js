import scrape from './index';
import sites from './site-stats';
import fs from 'fs';
import { URL } from 'url';
import { mapSeries } from 'p-iteration';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

const metatags = (cache) => (prop) => {
    if (Array.isArray(prop)) {
        let item = prop.find(e => cache.metatags && cache.metatags[e] && cache.metatags[e][0]);
        return cache.metatags && cache.metatags[item] && cache.metatags[item][0];
    }

    return cache.metatags && cache.metatags[prop] && cache.metatags[prop][0];
}

const microdata = (cache) => (prop, subprop) => {
    if (Array.isArray(prop)) {
        let item = prop.find(e => cache.microdata && cache.microdata[e] && (subprop ? cache.microdata[e][0] && cache.microdata[e][0][subprop] : cache.microdata[e]));
        return cache.microdata && cache.microdata[e] && (subprop ? cache.microdata[item][0] && cache.microdata[item][0][subprop] : cache.microdata[item]);
    }

    return cache.microdata && cache.microdata[prop] && (subprop ? cache.microdata[prop][0] && cache.microdata[prop][0][subprop] : cache.microdata[prop])
}

const filterBullshit = (e) => {
    return e.player !== 'test' && !e.player.includes('.swf') && !e.player.includes('.html') && !e.player.includes('text/html')
}

describe('search with scheme', () => {
    test('should response scheme, most sites should have it', async () => {
        let cachePath = './assets/download/sheme-response.json';
        if (!fs.existsSync(cachePath)) {
            let result = await mapSeries(sites, async (e, index) => {
                console.log(index, sites.length);
                return await scrape({
                    uri: e.url
                });
            });

            fs.writeFileSync(cachePath, JSON.stringify( result.map(e=> e.scheme) ), "utf8");
        }

        let cache = require('../../assets/download/sheme-response.json');

        let videoPlayerUrlAndName = cache.map((e, index)=> {
            // console.log(`${index}/${cache.length}`);
            // console.log(e);

            let tags = metatags(e);
            let scheme = microdata(e);

            let name = tags(['title', 'og:title', 'twitter:title']) || scheme('VideoObject', 'name');
            let player = tags(['og:video:iframe','og:video']) || scheme('embedURL');

            return {name, player};
        }).filter(e=> e.name && e.player).filter(filterBullshit);

        let joinSameDomain = Object.values(videoPlayerUrlAndName.reduce((result, obj)=>{
            let domain = null;
            try {
                domain = (new URL(obj.player)).origin;
            } catch (err) {
                domain = 'broken';
            }
            result[domain] = obj;
            return result;
        },{}));

        console.log(cache.length, '->', videoPlayerUrlAndName.length, '->', joinSameDomain.length);
        console.log(joinSameDomain);

        expect(videoPlayerUrlAndName.length).toBeLessThan(cache.length);
        expect(joinSameDomain.length).toBeLessThan(videoPlayerUrlAndName.length);
    });
});
