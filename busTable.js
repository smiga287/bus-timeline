const isNextArrival = document => {
  const NEXT_ARRIVAL_TEXT = "Prvi sledeći polasci:";
  const TABLE_DESCRIPTION = ".tablepress-table-description";
  return Array.from(document.querySelectorAll(TABLE_DESCRIPTION)).find(
    desc => desc.innerText == NEXT_ARRIVAL_TEXT
  );
};

const getTable = document => {
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

const busTable = async (page, direction) => {
  const tableData = await page.evaluate(() => getTable(document));
  return tableData;
};

module.exports = {
  busAgenda
};
