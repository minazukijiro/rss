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
    for (let i = 1; i < data.length; i++) {
      let t = data[i];
      if (data[i].slice(0, 1) === '"') {
        t = data[i].slice(1);
        for (i = i + 1; data[i].slice(-1) !== '"' && i < data.length; i++) {
          t += ' ' + data[i];
        }
        t += ' ' + data[i].slice(0, -1);
      }
      tag.push(t);
    }

    let feed = await parser.parseURL(url);
    let n = 0;

    feed.items.forEach(item => {
      let hash = crypto.createHash('sha1').update(item.title).digest('hex').slice(-10);
      let filepath = 'content/posts/' + hash + '.md';

      if (!fs.existsSync(filepath)) {
        let title = feed.title;
        if ('title' in item) title = item.title;

        let dateStr = null;
        if ('isoDate' in item) dateStr = item.isoDate;
        else if ('pubDate' in item) date = item.pubDate;
        else if ('date' in item) date = item.date;

        let date;
        if (dateStr == null) date = new Date();
        else date = new Date(dateStr);

        let today = new Date();
        let expiryDate = new Date();
        expiryDate.setDate(today.getDate() + 7);

        let markdown = '';
        if ('content' in item) markdown = turndownService.turndown(item.content);
        else {
          let r = await fetch(item.link);
          markdown = turndownService.turndown(await r.text());
        }

        let text = util.format('+++\ntitle = """%s"""\ndate = %s\nexpiryDate = %s\ntags = %s\n+++\n%s\n\n[[source]](%s)\n',
                               title, date.toISOString(), expiryDate.toISOString(), JSON.stringify(tag), markdown, item.link);
        fs.writeFileSync(filepath, text, err => { if (err) { console.log(err); throw(err) } });

        n++;
      }
    });

    console.log(util.format('%s: new %d/%d items', feed.title, n, feed.items.length));
  });
})();
