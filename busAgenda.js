const busAgenda = async (page, direction) => {
  /*//WIP
  const dirSelector = ".vc_tta-tabs-list a";
  const dirLink = await page.evaluate(
    (dir, dirSelector) =>
      Array.from(document.querySelectorAll(dirSelector))[dir ? 0 : 1].href,
    direction,
    dirSelector
  );
  await page.goto(dirLink); //Maybe find a way to click and not go to another page
  */
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

module.exports = {
  busAgenda
};
