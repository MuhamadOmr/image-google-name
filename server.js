const puppeteer = require("puppeteer");
const express = require('express');


const app = express();

const GOOGLE_SEARCH_SELECTOR = '#topstuff > div > div.r5a77d > a';

(async ()=> {

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });

  const page = await browser.newPage();

  async function getName() {
    await page.goto(`https://www.google.com/searchbyimage?site=search&sa=X&image_url=https%3A%2F%2Fwww.undecode.com%2Fmansour%2F1.jpg%0D%0A`, {
      waitUntil: "networkidle0",
      timeout: 3000000
    });


    const searchValue = await page.$eval(GOOGLE_SEARCH_SELECTOR, el => el.innerHTML);

    return searchValue;
  }

  app.get('/name', async (req, res) => {

    let name = '';

    name = await getName();
    if (!name) {
      return res.status(404).json({
        error: 'url is not provided'
      });
    }

    return res.status(200).json({
      name
    });
  });

  app.listen(3000, () => console.log('Example app listening on port 3000!'))

})();