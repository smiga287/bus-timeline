const puppeteer = require("puppeteer");
const { busLink } = require("./busLink");
const { busTable } = require("./busTable");

const HOMEPAGE = "https://www.busevi.com/";

const busTimeline = async busNum => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(HOMEPAGE);
  const adress = await busLink(page, busNum);
  console.log("adress", adress);
  await page.goto(adress);
  const timeline = await busTable(page);
  console.log("timeline", timeline);
  // const alterTimeline = await busTable(page, false);
  // console.log("alterTimeline", alterTimeline);*/
  await browser.close();
};

busTimeline(94);
