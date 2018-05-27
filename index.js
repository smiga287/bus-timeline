const puppeteer = require("puppeteer");

const HOMEPAGE = "https://www.busevi.com/";

const agenda = async page => {
  const VIEW_ALL_SELECTOR = "select";
  const OPTION_VALUE = "-1";
  await page.select(VIEW_ALL_SELECTOR, OPTION_VALUE);
  const data = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".row-hover tr"));
    rows.shift(); //Removes the Next arival
    return rows.map(row => {
      const children = Array.from(row.children);
      const h = children.shift().innerText;
      return children.map((days, idx) => {
        const rest = days.innerText.split(" ");
        return rest.map(m => `${h}:${m}`);
      });
    });
  });
  const getHour = arr => parseInt(arr[0][0].substr(0, arr[0][0].indexOf(":")));
  const first = getHour(data[0]);
  return data.filter((hours, idx) => getHour(hours) === first + idx); // Filter out the duplicates created by the other route
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

const busTimeline = async busNum => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(HOMEPAGE);
  const adress = await busLink(page, busNum);
  await page.goto(adress);
  const timeline = await agenda(page);
  console.log("timeline", timeline);
  await browser.close();
};

busTimeline(15);
