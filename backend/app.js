const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys.js");
const cors = require("cors");

app.use(cors());

require("./models/model");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));
mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
  console.log("DB connection successful!");
});

mongoose.connection.on("error", () => {
  console.log("Error connecting to DB!");
});

app.listen(port, () => {
  console.log("Running on port" + " " + port);
});
