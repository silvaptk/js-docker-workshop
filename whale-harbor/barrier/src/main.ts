const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const env = require("dotenv");
const { v4: uuid } = require("uuid");

const Redis = require("./redis");

env.config();

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.post("/pass-through", async (request, response) => {
  const { whaleId } = request.body;

  if (!whaleId) {
    return response
      .status(400)
      .json({ message: "Whale identifier must be specified", status: "error" });
  }

  const ticket = uuid();

  await Redis.set(ticket, whaleId.toString());

  response.json({
    message: "The whale can pass through",
    ticket,
    status: "success",
  });
});

server.post("/validate-ticket", async (request, response) => {
  const { ticket } = request.body;

  if (!ticket) {
    return response.status(400).json({
      message: "Please provide a ticket",
      status: "error",
    });
  }

  const targetWhaleId = await Redis.get(ticket);

  if (!targetWhaleId) {
    return response.status(404).json({
      message: "Invalid ticket",
      status: "error",
    });
  }

  response.json({
    message: "Ticket is valid",
    status: "success",
    whaleId: Number(targetWhaleId),
  });
});

server.listen(8082, () => {
  console.log("Whale Harbor Barrier is working")
});
