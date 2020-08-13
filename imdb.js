const puppeteer = require('puppeteer');
const fs = require('fs');

 (async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.imdb.com/imdbpicks/august-2020-tv-calendar/ls087135653/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e312db5f-3174-47f6-ae69-6e09af32600b&pf_rd_r=1ST3070AP3W31WK82Z5T&pf_rd_s=center-6&pf_rd_t=60601&pf_rd_i=whats-on-tv&ref_=fea_wot_pks_tv_820_sm', 
  {waitUntil: 'load', timeout: 0});
  setTimeout(async () => {

    console.log('evaluate')
    const movieList = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('div .lister-item.mode-detail')
      const movieArray = [...nodeList];
      const movieList = movieArray.map((item) => {
        const image = item.querySelector('img');
        const name = item.querySelector('h3').innerText;
        return {
          image: image.src,
          name,
        }
      })

      return movieList;

    });

    fs.writeFile('imdb.json', JSON.stringify(movieList, null, 2), err => {
      if (err) throw new Error('something went wrong')
      console.log('well done!')
    })
  
    //await browser.close();
  }, 10000);

})();
