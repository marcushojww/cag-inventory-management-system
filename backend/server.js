require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const express = require("express");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());

const db = require("./app/models");
if (process.env.NODE_ENV !== "test") {
  db.sequelize
    .sync()
    .then(() => {
      console.log("----- DB SYNC SUCCESS -----");
    })
    .catch((err) => {
      console.error(err);
      console.error("----- FAILED TO SYNC DB -----");
    });
}

require("./app/routes/items.routes")(app);

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
