const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/intellinews";

const connecTomongo = () => {
  let result = mongoose.connect(mongoURL);
  if (result) {
    console.log("database connected successfully connected");
  }
};
module.exports = connecTomongo;
