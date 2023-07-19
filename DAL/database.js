const mongoose = require("mongoose");

class DatabaseClass {
  constructor(databaseURL) {
    this.databaseURL = databaseURL;
  }
  async connect() {
    await mongoose.connect(this.databaseURL);
  }
}

module.exports = DatabaseClass;
