const puppeteer = require("puppeteer");
const express = require('express');


const app = express();

const GOOGLE_SEARCH_SELECTOR = '#topstuff > div > div.r5a77d > a'

async function run() {

  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();

  async function getName(url) {
    await page.goto(`https://www.google.com/searchbyimage?site=search&sa=X&image_url=${url}`, {
      waitUntil: "networkidle0",
      timeout: 3000000
    });


    const searchValue = await page.$eval(GOOGLE_SEARCH_SELECTOR, el => el.innerHTML);

    return searchValue;
  }

  app.get('/name/:url', async (req, res) => {
    const {
      params: {
        url
      }
    } = req;

    let name = '';
    if (!url) {
      return res.status(404).json({
        error: 'url is not provided'
      });
    }


    name = await getName(url);

    return res.status(200).json({
      name
    });
  });

  app.listen(3000, () => console.log('Example app listening on port 3000!'))

}

run();