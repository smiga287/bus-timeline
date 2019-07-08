// *  Returns a link to the page for the specified bus
const busLink = async (page, busNum) => {
  const PANEL = ".vc_tta-panel-body";
  const BUS_NUM_SELECTOR = ".vc_btn3";
  await page.waitForSelector(PANEL);
  const link = await page.$$eval(
    BUS_NUM_SELECTOR,
    (links, busNum) => links.find(l => l.textContent.includes(busNum)).href,
    busNum.toString()
  );
  return link;
};

module.exports = {
  busLink
};
