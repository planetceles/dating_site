const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const db = require("./db");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));