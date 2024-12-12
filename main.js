const FeedMe = require('feedme');
const { Readable } = require( "stream" );

const TurndownService = require('turndown');
const turndownService = new TurndownService();

const util = require('util');
const crypto = require('crypto');

const f = async (url, tag) => {
  if (url === '') return;
  fetch(url)
    .then(res => {
      if (!res.ok) {
        console.error(new Error(`status code ${res.status}`));
        return;
      }

      const parser = new FeedMe(true);

      parser.on('finish', () => {
        const feed = parser.done();

        let n = 0;
        feed.items.forEach(item => {
          let hash = crypto.createHash('sha1').update(item.title).digest('hex').slice(-10);
          let filepath = 'content/posts/' + hash + '.md';
          if (fs.existsSync(filepath)) return;

          let pubdate;
          if ('pubdate' in item)
            pubdate = new Date(item.pubdate);
          else if ('dc:date' in item)
            pubdate = new Date(item['dc:date']);

          let today = new Date();
          let expirydate = new Date();
          expirydate.setDate(today.getDate() + 3);

          let description = typeof(item.description) === 'string' ? item.description : item.description.text;
          let content = description === '' ? '' : turndownService.turndown(description);

          let text = util.format('+++\ntitle = """%s"""\ndate = %s\nexpiryDate = %s\ntags = %s\n+++\n%s\n\n[[source]](%s)\n',
                                 item.title, pubdate.toISOString(), expirydate.toISOString(), JSON.stringify(tag), content, item.link);

          fs.writeFileSync(filepath, text, err => { if (err) { console.log(err); throw(err) } });

          n++;
        });

        console.log(`${feed.title}: ${n}/${feed.items.length}`);
      });

      Readable.fromWeb(res.body).pipe(parser);
    });
}

const fs = require('fs');

(async () => {
  const text = fs.readFileSync('./urls');
  const arr = text.toString().split('\n');
  arr.forEach(async elem => {
    let a = elem.split(' ');
    let url = a[0];
    let tag = [];
    if (url !== '') {
      for(let i = 1; i < a.length; i++) {
        let t = a[i];
        if (a[i].slice(0, 1) === '"') {
          t = a[i].slice(1);
          for (i = i + 1; a[i].slice(-1) !== '"' && i < a.liength; i++)
            t += ' ' + a[i];
          t += ' ' + a[i].slice(0, -1);
        }
        tag.push(t);
      }
    }

    f(url, tag);
  });
})();
