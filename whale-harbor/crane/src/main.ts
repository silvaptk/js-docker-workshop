const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv");

env.config();

const sequelize = require("./sequelize");
const Warehouse = require("./models/Warehouse");

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.post("/load", async (request, response) => {
  const { ticket } = request.body;

  if (!ticket) {
    return response.status(400).json({
      message: "A ticket must be provided",
      status: "error",
    });
  }

  const { whaleId } = await fetch(
    `${process.env.BARRIER_URL}/validate-ticket`,
    {
      method: "POST",
      body: JSON.stringify({ ticket }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((result) => result.json());

  if (!whaleId) {
    return response.status(401).json({
      message: "The ticket is not valid",
      status: "error",
    });
  }

  const warehouses = await Warehouse.findAll();

  const targetWarehouseIndex = Math.round(
    Math.random() * (warehouses.length - 1)
  );
  const targetWarehouse = warehouses[targetWarehouseIndex];

  const freightData = {
    whaleId,
    warehouse: targetWarehouse.name,
    departure: new Date(),
    arrival: new Date(Date.now() + 1000 * targetWarehouse.distance),
  };

  await fetch(`${process.env.MISSION_CONTROL_URL}/freight`, {
    method: "POST",
    body: JSON.stringify(freightData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json({
    status: "success",
    message: "Whale was loaded and is going to the warehouse",
    data: freightData,
  });
});

new Promise<void>(async (resolve, reject) => {
  let isSynced = false;
  let delay = 1000;

  while (true) {
    try {
      await sequelize.sync();

      isSynced = true;
      break;
    } catch {
      if (delay > 128 * 1000) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = delay * 2;
    }
  }

  if (isSynced) {
    resolve();
  } else {
    reject();
  }
})
  .then(() => {
    server.listen(8083);

    Warehouse.findAndCountAll().then((result) => {
      if (!result.count) {
        Warehouse.bulkCreate([
          { name: "Warehouse A", distance: 10 },
          { name: "Warehouse B", distance: 20 },
          { name: "Warehouse C", distance: 30 },
        ]);
      }
    });

    console.log("Whale Harbor Crane is working!");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
