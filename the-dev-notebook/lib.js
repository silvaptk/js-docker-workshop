const fileSystem = require("fs");
const path = require("path");

const dataFilePath = path.join(process.cwd(), "data.json");

const getData = () => {
  if (!fileSystem.existsSync(dataFilePath)) {
    fileSystem.writeFileSync(dataFilePath, "[]");

    return [];
  }

  return JSON.parse(fileSystem.readFileSync(dataFilePath));
};

const addEntry = (entry) => {
  try {
    const data = getData();

    data.push(entry);

    fileSystem.writeFileSync(dataFilePath, JSON.stringify(data));

    return true;
  } catch (error) {
    console.error(error)

    return false;
  }
};

module.exports = {
  getData,
  addEntry,
}
