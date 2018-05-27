const puppeteer = require("puppeteer");
//Add a DB

const HOMEPAGE = "https://www.busevi.com/";

const agenda = async page => {
  let data = [];
  let filter = [];
  const nextPageSelector = ".next";
  //4 replace with the number of pages
  for (let i = 1; i <= 4; i++) {
    if (i > 1) {
      await page.click(nextPageSelector);
      await page.waitForSelector(`.row-${i + 5}`);
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
  return data;
};

const busLink = async (page, num) => {
  const PANEL = ".vc_tta-panel-body";
  const NUM_SELECTOR = ".vc_btn3";
  await page.waitForSelector(PANEL);
  const link = await page.evaluate(
    async (num, selector) =>
      Array.from(document.querySelectorAll(selector)).find(a =>
        a.textContent.includes(`${num}`)
      ).href,
    num,
    NUM_SELECTOR
  );
  return link;
};

const busTimeline = async (busNum, direction) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(HOMEPAGE);
  const adress = await busLink(page, busNum);
  await page.goto(adress);
  // if (!direction) {
  //   await alterDirection();
  // }
  const timeline = await agenda(page);
  console.log("timeline", timeline);
  await browser.close();
};

busTimeline(94, true); // Parametarize
