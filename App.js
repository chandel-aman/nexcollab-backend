const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

//IMPORT ROUTES

const projectRoute = require("./routes/project-routes");
const userRoute = require("./routes/user-routes");

dotenv.config();

//CONNECTION TO DATABASE

mongoose.connect(
  `${process.env.ATLAS_URI}`,
  { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true },
  () => console.log("connected to db")
);
//MIDDLEWARE

app.use(express.json(), cors());

//ROUTE MIDDLEWARE

app.use("/api/user", userRoute);
app.use("/api/project", projectRoute);

app.get("/", (req, res) => {
  res.send(`<h3>Hey! Code Backend is up !</h3>`);
});

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));