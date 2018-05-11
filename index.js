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

  const getInitData = await page.evaluate(async pageH => {
    let rows = [];
    for (let p = 2; p < 21; p += 5) {
      for (let i = p; i <= p + 4; i++) {
        const row = document.querySelector(`.row-${i}`);
        console.log(row);
        const row = 0;
        rows.push(row);
      }
      const nextPageSelector = ".next";
      await pageH.click(nextPageSelector);
    }
    return rows;
  }, page);

  const sortedData = await page.evaluate(async () => {
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
  console.log(sortedData);

  await browser.close();
};

run();
