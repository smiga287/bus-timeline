const getNextButton = async nextButtonDOM => {
  const NEXT_BUTTON = ".next";
  const nextButton = await nextButtonDOM.$(NEXT_BUTTON);
  return nextButton;
};

const isNextArrival = page => {
  const NEXT_ARRIVAL_TEXT = "Prvi sledeći polasci:";
  const TABLE_DESCRIPTION = ".tablepress-table-description";
  return page.$$eval(TABLE_DESCRIPTION, nodes =>
    nodes.includes(desc => desc.innerText === NEXT_ARRIVAL_TEXT)
  );
};

const getCurrentTable = (rows, isNextArrival) => {
  rows.splice(5); // Discards cached rows from the other table (different direction)

  if (isNextArrival) {
    rows.shift(); // Removes the Next arrival row
  }

  return rows.reduce((acc, row) => {
    const children = Array.from(row.children);
    const hour = children.shift().innerText;
    const minutes = children.map(child =>
      child.innerText.split(" ").map(minute => parseInt(minute))
    );
    return {
      ...acc,
      [hour]: minutes
    };
  }, {});
};

const getTableData = async (tableDOM, page) => {
  let tableData = {};
  const ROWS = ".row-hover tr";
  const TABLE_COUNT = 5;
  const NEXT_BUTTON_PARENT = ".paging_simple";
  const nextButtonDOM = await tableDOM.$(NEXT_BUTTON_PARENT);
  for (let i = 0; i < TABLE_COUNT; i++) {
    // TODO: Change this to a while(hasNextTable())
    // ? Must be inside of for loop because a new next button is created when tables are paginated
    const nextButton = await getNextButton(nextButtonDOM);
    const currentTable = await tableDOM.$$eval(ROWS, getCurrentTable, () =>
      isNextArrival(tableDOM)
    ); // isNextArrival is passed as third argument to $$eval so that getCurrentTable gets it as a second argument

    tableData = {
      ...tableData,
      ...currentTable
    };

    await nextButton.click();
    await page.waitFor(500);
  }
  return tableData;
};

const busTable = async page => {
  const ACTIVE_TABLE = ".vc_tta-panel.vc_active";
  const searchSpace = await page.$(ACTIVE_TABLE);
  const timeline = await getTableData(searchSpace, page);
  return timeline;
};

module.exports = {
  busTable
};
