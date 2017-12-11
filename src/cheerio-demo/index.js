import cheerio from 'cheerio';

const $ = cheerio.load(`
<ul id="cities">
    <li class="large">New York</li>
    <li id="c-medium">Portland</li>
    <li class="small">Salem</li>
</ul>

<ul id="towns">
    <li class="large">Bend</li>
    <li id="t-medium">Hood River</li>
    <li class="small">Madras</li>
</ul>`);

export default $;
