const puppeteer = require("puppeteer");
const fs = require("fs");

const busNum = 94;

const PAGE =
  "https://www.busevi.com/red-voznje/linija-94-novi-beograd-blok-45-resnik-edvarda-griga/";

const TABLE = "#tablepress-584";

const run = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(PAGE);
  await page.waitForSelector(TABLE);

  // 2 -> 6
  // 7 -> 11
  // 12 -> 16
  // 17 -> 21
  let data = [];
  let filter = [];
  const nextPageSelector = ".next";
  for (let i = 1; i <= 4; i++) {
    if (i > 1) {
      await page.click(nextPageSelector);
    }
    let unfiltered = await page.evaluate(async () => {
      const rows = Array.from(document.querySelectorAll(".row-hover tr"));
      // rows.shift(); //Because of the Sledeci polazak
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

run();
