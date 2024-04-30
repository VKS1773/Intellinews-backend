const connectTomongo = require("./db");
const express = require("express");
var cors = require("cors");
connectTomongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); //for accepting input from req.body;

//availabel routes
app.use("/api/auth", require("./routes/auth"));
app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}`);
});
