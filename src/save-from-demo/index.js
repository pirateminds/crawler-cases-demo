import superagent from 'superagent';
import Sandbox from 'sandbox';

const ssUrl = "http://ru.savefrom.net/savefrom.php";

const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cookie": "lang=ru; PHPSESSUD=3021e68df9a7200135725c6331369a22; rmode=true",
    "Host": "ru.savefrom.net",
    "Origin": "http://ru.savefrom.net",
    "Referer": "http://ru.savefrom.net/",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36"
};

function getUrl(text, callback) {
    text = text.replace(/^.*?<script.*?>([\s\S]+)<\/script.*$/m, '$1');
    const hilariousPieceOfShitToFuckSaveFrom = `
    var window = { location: { hostname : "ru.savefrom.net" },
    parent: { sf: { finishRequest : function(){}, enableElement : function(){},
        videoResult : { show: function(data){
            console.log(data);
          }
        }
      }, document : { getElementById: function(){ return { innerHTML : true } } } } };

  var document = { body: { firstChild : false, removeChild : function(){}} };
  var alert = function(arg){ console.log(arg); };
window.location.hostname.search = function() {return true};`;

    text = text.replace(/^\s*\(function\(\)\{/, m => m + hilariousPieceOfShitToFuckSaveFrom);

    try {
        new Sandbox().run(text, (obj) => {
            callback(obj.console.length !== 1 ? false :
                obj.console.length === 1 &&
                chooseBestVideo(obj.console[0].url));
        });
    } catch (e) {
        callback(false);
    }
}

function chooseBestVideo(options) {
    const quality = e => Number(
        (e.quality && e.quality.substr(0, -1)) ||
        (e.subname && e.subname.substr(0, -1)) ||
        e.ext === 'mp4' ||
        ~e.url.indexOf('mp4')
    );
    options = options.filter(({ name }) => name === 'MP4').sort((a, b) => quality(a) < quality(b));
    return options.length ? options[0].url : false;
}


const scrape = (url, callback) => {
    let promise = new Promise((res) => {
        superagent.agent()
            .post(ssUrl)
            .send({
                'sf_url': url,
                'sf_submit': '',
                'lang': 'ru',
                'new': 1
            })
            .set(headers)
            .end((err, { text }) => { getUrl(text, res); });
    });

    if (callback) {
        return promise.then(callback);
    }

    return promise;
};


export default scrape;
