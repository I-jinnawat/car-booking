const express = require("express");
const { readdirSync } = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 8080;

const connectDB = require("./Config/db");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

readdirSync("./Routes").map((r) => app.use("/", require("./Routes/" + r)));

// The connectDB function should be invoked before starting the server
connectDB()
  .then(
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`)
    )
  )
  .catch((err) => console.log(err));
