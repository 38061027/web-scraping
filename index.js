const puppeteer = require("puppeteer");
const url = "https://www.imdb.com/";
const search = "Star Wars";
let c = 1;
let list = [];

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-web-security",
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  const randomDelay = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  async function humanDelay() {
    await new Promise((resolve) =>
      setTimeout(resolve, randomDelay(1000, 3000))
    );
  }

  console.log("Início");
  await page.goto(url);
  await page.waitForSelector("#suggestion-search");

  await humanDelay();
  await page.type("#suggestion-search", search);

  await humanDelay();
  await Promise.all([
    page.waitForNavigation(),
    page.click(".nav-search__search-submit"),
  ]);

  const links = await page.$$eval(
    ".ipc-metadata-list-summary-item__tc > a",
    (el) => el.map((link) => link.href)
  );

  for (const link of links) {
    if (c === 6) continue;
    console.log("Pagina =>", c);

    await humanDelay();
    await page.goto(link);

    await humanDelay();
    const title = await page.$eval(
      ".hero__primary-text",
      (element) => element.innerText
    );

    await humanDelay();
    const director = await page.$eval(
      ".ipc-metadata-list-item__list-content-item",
      (element) => element.innerText
    );

    await humanDelay();
    const review = await page.$eval(
      ".sc-eb51e184-1",
      (element) => element.innerText
    );

    const obj = {};
    obj.title = title;
    obj.director = director;
    obj.link = link;
    obj.review = review;
    list.push(obj);

    c++;
    console.log(obj);
  }


  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await delay(3000);

  await browser.close();
})();
