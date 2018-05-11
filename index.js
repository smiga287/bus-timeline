const puppeteer = require("puppeteer");
//Add a DB
const busNum = 94;

const PAGE =
  "https://www.busevi.com/red-voznje/linija-94-novi-beograd-blok-45-resnik-edvarda-griga/";

const TABLE = "#tablepress-584";

const run = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(PAGE);
  await page.waitForSelector(TABLE); //Change this so it works on every bus line

  let data = [];
  let filter = [];
  const nextPageSelector = ".next";
  for (let i = 1; i <= 4; i++) {
    if (i > 1) {
      await page.click(nextPageSelector);
      /* 
        Add a _waitforSomeElement_ cause of the 94 9h bug
        when switching pages the first hour row from other route is used
      */
    }
    let unfiltered = await page.evaluate(async () => {
      const rows = Array.from(document.querySelectorAll(".row-hover tr"));
      return rows.map(row => {
        const children = Array.from(row.children);
        const h = children.shift().innerText;
        return children.map((days, idx) => {
          const rest = days.innerText.split(" ");
          return rest.map(m => `${h}:${m}`);
        });
      });
    });
    unfiltered.map(hourArr => {
      const hour = hourArr[0][0].substr(0, hourArr[0][0].indexOf(":"));
      if (!filter.includes(hour)) {
        data.push(hourArr);
        filter.push(hour);
      }
    });
  }
  console.log(data);

  await browser.close();
};

run(); // Parametarize
