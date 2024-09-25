const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

env.config();

const sequelize = require("./sequelize");
const Batch = require("./models/Batch");

const server = express();

server.use(bodyParser.json());
server.use(cors());

server.get("/plantation", async (_, response) => {
  const batches = await Batch.findAll();

  return response.json(
    batches.map((batch) => ({
      id: batch.id,
      status: batch.status,
      name: batch.name,
    }))
  );
});

server.post("/dig", async (request, response) => {
  try {
    const newBatch = await Batch.create({ status: "untouched", name: "" });

    response.json({
      message: "Batch created",
      status: "success",
      batch: newBatch,
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message: "Error while digging to create a batch",
      status: "error",
    });
  }
});

server.put("/plant/:batchId", async (request, response) => {
  const { batchId } = request.params;
  const { name } = request.body;

  const batch = await Batch.findByPk(batchId);

  if (!batch) {
    return response
      .status(404)
      .json({ message: "Batch not found", status: "error" });
  }

  batch.set("name", name);
  batch.set("status", "growing");

  await batch.save();

  return response.json({ message: "Planted!", status: "success" });
});

server.put("/water/:batchId", async (request, response) => {
  const { batchId } = request.params;

  const batch = await Batch.findByPk(batchId);

  if (!batch) {
    return response
      .status(404)
      .json({ message: "Batch not found", status: "error" });
  }

  batch.set("status", Math.random() > 0.5 ? "ready" : "dead");

  await batch.save();

  let message;

  if (batch.get("status") === "ready") {
    message = "The plant is ready to harvest!";
  } else {
    message = "Oh no... I think you watered the plant too much. It is dead now";
  }

  return response.json({ status: "success", message });
});

server.put("/harvest/:batchId", async (request, response) => {
  const { batchId } = request.params;

  const batch = await Batch.findByPk(batchId);

  if (!batch) {
    return response
      .status(404)
      .json({ message: "Batch not found", status: "error" });
  }

  let message;

  switch (batch.get("status")) {
    case "ready":
      message = `Great! Here are your ${batch.get("name")}`;
      break;
    case "growing":
      message = `Plant removed!`;
      break;
    case "untouched":
      message = `Hey what you're gonna do with this soil?`;
      break;
    case "dead":
      message = `The plant is dead so you got nothing`;
  }

  batch.set("status", "untouched");
  batch.set("name", "");

  await batch.save();

  return response.json({ message, status: "success" });
});

sequelize
  .sync()
  .then(() => {
    server.listen(8081);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
