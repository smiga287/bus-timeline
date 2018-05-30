const busLink = async (page, num) => {
  const PANEL = ".vc_tta-panel-body";
  const NUM_SELECTOR = ".vc_btn3";
  await page.waitForSelector(PANEL);
  const link = await page.evaluate(
    async (num, selector) =>
      Array.from(document.querySelectorAll(selector)).find(
        a => a.textContent.includes(`${num}`.toUpperCase()) // For buses like 68N / EKO 1 / E6 / 81L
      ).href,
    num,
    NUM_SELECTOR
  );
  return link;
};

module.exports = {
  busLink
};
