import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { mapSeries } from 'p-iteration';

const options = {
    search: 'bicoin',
    maxPage: 100,
    launch: { headless: false },
    setViewport: { width: 1240, height: 680 },
    transform: (body) => cheerio.load(body)
};

const login = async(page, options) => {
    const CREDS = {
        username: options.username,
        password: options.password
    };

    const USERNAME_SELECTOR = '#login_field';
    const PASSWORD_SELECTOR = '#password';
    const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

    await page.goto('https://github.com/login');
    // dom element selectors
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    await page.click(BUTTON_SELECTOR);
    await page.waitForNavigation();
}

const getSearchUrl = (options) => {
    const userToSearch = options.search || 'john';
    return `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;
}

const search = async (page, options)=> {
    await page.goto(getSearchUrl(options), {waitUntil: ['domcontentloaded']});
}

async function getNumPages(page, options) {
    const NUM_USER_SELECTOR = '#js-pjax-container > div.container > div > div.column.three-fourths.codesearch-results.pr-6 > div.d-flex.flex-justify-between.border-bottom.pb-3 > h3';

    let content = await page.content();
    let $ = options.transform(content);

     // format is: "69,803 users"
    let inner = ($(NUM_USER_SELECTOR)
                .html() || '')
                .replace(',', '')
                .replace('users', '')
                .trim();
    const numUsers = parseInt(inner);
    /**
     * GitHub shows 10 resuls per page, so
     */
    let num = Math.ceil(numUsers / 10);
    return num > options.maxPage ? options.maxPage || 100 : num;
}

const receiveUserMeta = async(index, page, options) => {
    const LENGTH_SELECTOR_CLASS = '.user-list-item';

    const LIST_USERNAME_SELECTOR = '.user-list-info.ml-2 > a';
    const LIST_EMAIL_SELECTOR = '.octicon.octicon-mail + a.muted-link';

    let pageUrl = getSearchUrl(options) + '&p=' + index;

    await page.goto(pageUrl, {waitUntil: ['domcontentloaded']});

    let content = await page.content();
    let $ = options.transform(content);

    return $(LENGTH_SELECTOR_CLASS).map(function() {
        return {
            username: $(this).find(LIST_USERNAME_SELECTOR).eq(0).text(),
            email: $(this).find(LIST_EMAIL_SELECTOR).eq(0).text()
        };
    }).get().filter(e => e.email);
}

const timesFunction = function(callback) {
    if (typeof callback !== "function" ) {
      throw new TypeError("Callback is not a function");
    } else if( isNaN(parseInt(Number(this.valueOf()))) ) {
      throw new TypeError("Object is not a valid number");
    }

    let arr = [];
    for (let i = 0; i < Number(this.valueOf()); i++) {
        arr.push(i);
    }

    return mapSeries(arr, callback);
};

String.prototype.times = timesFunction;
Number.prototype.times = timesFunction;


const scrape = async (options) => {
    const browser = await puppeteer.launch(options.launch);
    const page = await browser.newPage();

    await page.setViewport(options.setViewport);
    await login(page, options);
    await search(page, options);

    const numPages = await getNumPages(page, options);

    let users = await numPages.times(async (index)=> {
        return await receiveUserMeta(index + 1, page, options);
    });

    browser.close();

    return [].concat(...users);
}

export default (params)=> scrape({...options, ...params });
