const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys.js");
const cors = require("cors");

app.use(cors());

require("./models/model.js");
require("./models/post.js");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('connected to mongo');
});

mongoose.connection.on('error', (err) => {
  console.log('err connecting', err);
});

app.listen(port, () => {
  console.log("Running on port" + " " + port);
});
