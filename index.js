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

  const pageData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".row-hover tr"));
    rows.shift(); //Because of the Sledeci polazak
    return rows.map(row => {
      const children = Array.from(row.children);
      const h = children.shift().innerText;
      return children.map((days, idx) => {
        const rest = days.innerText.split(" ");
        return rest.map(m => `${h}:${m}`);
      });
    });
  });
  console.log(pageData);

  await browser.close();
};

run();
