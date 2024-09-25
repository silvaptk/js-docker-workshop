const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv");

env.config();

const sequelize = require("./sequelize");
const Whale = require("./models/Whale");

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.post("/freight", async (request, response) => {
  const { whaleId, arrival, departure, warehouse } = request.body;

  const whale = await Whale.findByPk(whaleId);

  whale.set("arrival", arrival);
  whale.set("departure", departure);
  whale.set("warehouse", warehouse);
  whale.set("status", "traveling");

  await whale.save();

  const delay = new Date(arrival).getTime() - Date.now();

  setTimeout(() => {
    whale.set("arrival", null);
    whale.set("departure", null);
    whale.set("warehouse", null);
    whale.set("status", "staging");

    whale.save();
  }, delay);

  response.json({
    message: "Freight registered",
    status: "success",
  });
});

server.get("/overview", async (_, response) => {
  const whales = await Whale.findAll();

  response.status(200).json(whales);
});

new Promise<void>(async (resolve, reject) => {
  let isSynced = false;
  let delay = 1000;
  let errorThrown;

  while (true) {
    try {
      await sequelize.sync();

      isSynced = true;
      break;
    } catch (error) {
      errorThrown = error;
      if (delay > 32 * 1000) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = delay * 2;
    }
  }

  if (isSynced) {
    resolve();
  } else {
    reject(errorThrown);
  }
})
  .then(() => {
    server.listen(8081);

    Whale.findAndCountAll().then((result) => {
      if (!result.count) {
        Whale.bulkCreate([
          { name: "Whale 1" },
          { name: "Whale 2" },
          { name: "Whale 3" },
          { name: "Whale 4" },
          { name: "Whale 5" },
        ]);
      }
    });

    console.log("Whale Harbor Mission Control is working!");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
