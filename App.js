const express = require("express");
const { readdirSync } = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const connectDB = require("./Config/db");
const { patch } = require("./Routes/dashboard");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

//engine setup
app.set("Views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");

//routes
readdirSync("./Routes").map((r) => app.use("/", require("./Routes/" + r)));

// The connectDB function should be invoked before starting the server
connectDB()
  .then(
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`)
    )
  )
  .catch((err) => console.log(err));
