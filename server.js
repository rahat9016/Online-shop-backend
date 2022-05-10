const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");
require("dotenv").config();

//Import All routes
const authRouter = require("./routes/auth");

const app = express();
//DB
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log(error, "Error");
  });

// Middleware
app.use(morgan("dev"));
// parse application/json
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

app.use("/api", authRouter);
readdirSync("./routes").map((r) => {
  app.use("/api", require("./routes/" + r));
});
// PORT
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is Running ${port}`);
});
