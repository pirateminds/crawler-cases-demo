import request from 'request-promise';
import cheerio from 'cheerio';
import WAE from 'web-auto-extractor';

const options = {
  uri: "https://www.google.com",
  transform: (body) => ({
      scheme: WAE().parse(body),
      $: cheerio.load(body)
    })
};

const scrape = async (options) => {
    try {
        // console.log('uri', options.uri);
        let result = await request(options);
        // console.log(result.scheme);
        return result;
    } catch (err) {
        return {
            scheme: {},
            body: {}
        }
    }
};

export default (params)=> scrape({...options, ...params });
