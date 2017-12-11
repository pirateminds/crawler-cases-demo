import request from 'request-promise';
import cheerio from 'cheerio';

const options = {
  uri: "https://www.google.com",
  transform: (body) => cheerio.load(body)
};

const scrape = async (options) => {
  return await request(options);
};

export default (params)=> scrape({...options, ...params });
