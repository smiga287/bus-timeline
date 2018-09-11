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

    window.getCurrentTable = () => {
      const rows = Array.from(document.querySelectorAll(".row-hover tr"));
      rows.splice(5); // Discards cached rows from the other table

      if (isNextArrival()) {
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

const getTableData = async (page, direction) => {
  let tableData = {};
  const TABLE_COUNT = 5;
  for (let i = 0; i < TABLE_COUNT; i++) {
    const nextButton = await getNextButton(page, direction);
    currentTable = await page.evaluate(() => getCurrentTable());
    for (const hour of currentTable) {
      tableData = {
        ...tableData,
        ...hour
      };
    }
    await nextButton.click();
    await page.waitFor(500);
  }
  return tableData;
};

const selectOppositeDirection = page => {};

const busTable = async (page, direction = true) => {
  setFunctionContext(page);
  const tableData = getTableData(page, direction);
  selectOppositeDirection(page);
  const secondWay = getTableData(page, direction);
  return tableData;
};

module.exports = {
  busTable
};
