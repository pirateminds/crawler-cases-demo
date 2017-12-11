import scrape from './index';
import now from 'performance-now';
import { mapSeries } from 'p-iteration';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 999999;

const getPerformace = async (fn)=> {
    let start = now()
    await fn();
    return now() - start;
}

describe('puppeteer optimization test', () => {
    test('running browser should cost enought of time', async () => {
        let initTime = await getPerformace(()=> scrape({
            uri: "https://www.google.com/search?num=50&ei=tMQqWqKZIM-S6QT7lIHIDQ&q=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA%D0%BE%D0%BC%D0%B0%D1%80%D0%BE%D0%B2&oq=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA&gs_l=psy-ab.3.1.0l2j0i131k1j0j0i131k1j0l5.3795.6242.0.17152.8.6.0.2.2.0.77.409.6.6.0....0...1c.1.64.psy-ab..0.8.429...35i39k1j0i67k1.0.5MYOzwXO3gM",
        }));

        let urls = [
            'https://www.google.com/search?num=50&ei=tMQqWqKZIM-S6QT7lIHIDQ&q=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA%D0%BE%D0%BC%D0%B0%D1%80%D0%BE%D0%B2&oq=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA&gs_l=psy-ab.3.1.0l2j0i131k1j0j0i131k1j0l5.3795.6242.0.17152.8.6.0.2.2.0.77.409.6.6.0....0...1c.1.64.psy-ab..0.8.429...35i39k1j0i67k1.0.5MYOzwXO3gM',
            'https://www.google.com/search?q=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA%D0%BE%D0%BC%D0%B0%D1%80%D0%BE%D0%B2&num=50&source=lnms&tbm=isch&sa=X&ved=0ahUKEwj-37fI8frXAhUkJpoKHXRqCL0Q_AUICygC&biw=1427&bih=700',
            'https://www.google.com/search?q=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA%D0%BE%D0%BC%D0%B0%D1%80%D0%BE%D0%B2&tbm=vid&source=lnms&sa=X&ved=0ahUKEwjvwIPR8frXAhVEGZoKHYNZDYIQ_AUICigB&biw=1427&bih=700&dpr=2',
            'https://www.google.com/search?q=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA%D0%BE%D0%BC%D0%B0%D1%80%D0%BE%D0%B2&num=50&tbm=nws&source=lnms&sa=X&ved=0ahUKEwjS7ojc8frXAhXoCpoKHdD4AdkQ_AUIDCgD&biw=1427&bih=700&dpr=2',
            'https://www.google.com/maps?q=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA%D0%BE%D0%BC%D0%B0%D1%80%D0%BE%D0%B2&num=50&biw=1427&bih=700&dpr=2&um=1&ie=UTF-8&sa=X&ved=0ahUKEwjZ68bk8frXAhXkK5oKHWBuCLkQ_AUIDSgE',
            'https://www.google.com/search?q=%D0%B2%D0%B8%D0%BA%D1%82%D0%BE%D1%80+%D0%BA%D0%BE%D0%BC%D0%B0%D1%80%D0%BE%D0%B2&num=50&tbm=bks&source=lnms&sa=X&ved=0ahUKEwjZ68bk8frXAhXkK5oKHWBuCLkQ_AUIECgB&biw=1427&bih=700&dpr=2',
            'https://www.google.com/flights/',
        ];

        let otherResults = await mapSeries(urls, async (e)=> {
            return await getPerformace(()=> scrape({
                uri: e,
            }));
        });

        console.log(`Initial time ${initTime}, i.e. 1st link`);
        console.log('Other samples: ', otherResults);

        otherResults.forEach(e=> {
            expect(e).toBeLessThanOrEqual(initTime);
        });

        return true;
    });
});
