const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const { getData, addEntry } = require("./lib");

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.get("/", (_, response) => {
  const data = getData();

  response.send(data);
});

server.post("/", (request, response) => {
  const result = addEntry({
    ...request.body,
    date: new Date(),
  });

  if (result) {
    return response
      .status(200)
      .send({ status: "success", message: "Entry stored!" });
  }

  response.status(400).send({ status: "error", message: "Invalid request" });
});

server.listen(8080, () => {
  console.log("The dev. notebook!");
});