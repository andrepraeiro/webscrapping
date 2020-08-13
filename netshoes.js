const puppeteer = require('puppeteer');
const fs = require('fs');

 (async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.netshoes.com.br/tenis/feminino?mi=hm_ger_mntop_M-CAL-tenis&psn=Menu_Top');
  setTimeout(async () => {

    console.log('evaluate')
    const tenisList = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('div .item-card')
      const itemCardArray = [...nodeList];
      const tenisList = itemCardArray.map((item) => {
        const image = item.querySelector('img');
        const description = item.querySelector('div .item-card__description a span')
        const price = item.querySelector('span[data-price]')
        return {
          image: image.src,
          description: description.innerHTML,
          price: price.innerText
        }
      })

      return tenisList;

    });

    fs.writeFile('netshoes.json', JSON.stringify(tenisList, null, 2), err => {
      if (err) throw new Error('something went wrong')
      console.log('well done!')
    })
  
    await browser.close();
  }, 10000);

})();
