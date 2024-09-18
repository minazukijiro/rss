const Parser = require('rss-parser');
const parser = new Parser();

const TurndownService = require('turndown');
const turndownService = new TurndownService();

const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');
const util = require('util');

(async () => {
    const stream = fs.createReadStream('urls', 'utf8');
    const reader = readline.createInterface({input: stream});
    reader.on('line', async line => {
        data = line.split(' ');
        let url = data[0];
        let tag = [];
        for (let i = 1; i < data.length; i++) tag.push(data[i]);

        let feed = await parser.parseURL(url);
        console.log(feed.title + ': ' + feed.items.length + ' items');

        feed.items.forEach(item => {
            let hash = crypto.createHash('sha1').update(item.title).digest('hex').slice(-10);
            let filepath = 'content/posts/' + hash + '.md';

            let title = feed.title;
            if ('title' in item) title = item.title;

            let date = item.isoDate;
            if ('pubDate' in item) date = item.pubDate;
            else if ('date' in item) date = item.date;
            if (date != "") date = new Date(date).toISOString();

            let markdown = '';
            if ('content' in item) markdown = turndownService.turndown(item.content);

            let text = util.format('+++\ntitle = """%s"""\ndate = %s\ntags = %s\n+++\n%s\n\n[[source]](%s)\n', title, date, JSON.stringify(tag), markdown, item.link);

            fs.writeFileSync(filepath, text, err => { if (err) { console.log(err); throw(err) } });
        });
    });
})();
