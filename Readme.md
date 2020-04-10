<h1 align="center">Crawler cases demo</h1>

<p align="center">That the project written especially for <a href="https://holyjs-moscow.ru/">HollyJS 2017 in Moscow</a>.</p>

```javascript
npm test

//OR to run specific demo
npm test ./src/puppeteer-adblock-demo
```

Each demo written as a separate application. So feel free to change and mutate it. To tests your own tho.
All demo are under the `./src` directory

## Demo list

- [cheerio-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/cheerio-demo) - how to use cheerio on server side
- [puppeteer-adblock-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/puppeteer-adblock-demo) - how to create adblock logic for puppeteer
- [puppeteer-cheerio-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/puppeteer-cheerio-demo) - wrap puppeteer content to cheerio
- [puppeteer-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/puppeteer-demo) - the minimal code needs to run puppeteer
- [puppeteer-download-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/puppeteer-download-demo) - how to download file using puppeteer
- [puppeteer-linkedin-cookie-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/puppeteer-linkedin-cookie-demo) - how to scrape site using cookie againts the login - steps.
- [puppeteer-login-github](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/puppeteer-login-github) - common steps to login somewhere and receive some userfull private information.
- [puppeteer-optimization-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/puppeteer-optimization-demo) - experiments to optimize puppeteer load speed
- [request-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/request-demo) - common logic to to receive static html
- [request-puppeteer-together-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/request-puppeteer-together-demo) - how to switch requestjs to puppeteer runtime
- [save-from-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/save-from-demo) - show how to fight with ubnormal behavior sites, without puppeteer using sanbox on serverside.
- [scheme-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/scheme-demo) - examples to check SEO optimized sites
- [seasonvar-demo](https://github.com/pirateminds/crawler-cases-demo/tree/master/src/seasonvar-demo) - example with complex workflow to download video from common website.

## So, how to install it

```javascript
npm install
mv ./src/config.template.js ./src/config.js
```

The config used to set some private infos. Like github `login` / `password`. Site tokens.

---
Copyright (c) 2017 pirateminds.com. Licensed with The MIT License (MIT)
