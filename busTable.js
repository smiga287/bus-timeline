// ? Functions have to be defined inside the browser context
const setFunctionContext = async page => {
  return await page.evaluate(() => {
    window.isNextArrival = () => {
      const NEXT_ARRIVAL_TEXT = "Prvi sledeći polasci:";
      const TABLE_DESCRIPTION = ".tablepress-table-description";
      return Array.from(document.querySelectorAll(TABLE_DESCRIPTION)).find(
        desc => desc.innerText == NEXT_ARRIVAL_TEXT
      );
    };
    // ! TODO: Fuck the manual filtering. Create a Set-like structure that won't accept duplicate
    window.getCurrentTable = () => {
      const rows = Array.from(document.querySelectorAll(".row-hover tr"));
      rows.splice(5); // Discards cached rows from the other table

      if (isNextArrival(document)) {
        rows.shift(); //Removes the Next arival
      }

      return rows.map(row => {
        const children = Array.from(row.children);
        const hour = children.shift().innerText;
        const minutes = children.map(child =>
          child.innerText.split(" ").map(minute => parseInt(minute))
        );
        return {
          [hour]: minutes
        };
      });
    };
  });
};

const getNextButton = async (page, direction) => {
  const NEXT_BUTTONS = ".next";
  const nextButtons = await page.$$(NEXT_BUTTONS);
  return nextButtons[direction ? 0 : 1];
};

const nextTable = async (page, direction) => {
  nextButton = await getNextButton(page, direction);
  await nextButton.click();
  await page.waitFor(4000);
  //await page.waitForNavigation();
};

const getTableData = async (page, direction) => {
  let tableData = [];
  for (let i = 0; i < 2; i++) {
    currentTable = await page.evaluate(() => getCurrentTable());
    tableData.push(currentTable);

    nextTable(page, direction);
  }
  return tableData;
};

const busTable = async (page, direction = true) => {
  setFunctionContext(page);
  const tableData = getTableData(page, direction);
  return tableData;
};

module.exports = {
  busTable
};
