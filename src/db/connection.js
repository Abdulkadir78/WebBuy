const mongoose = require("mongoose");

const connectToDb = async (app) => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log(`Connected to MongoDB: ${connection.connection.host}`);
    app.emit("ready");
  } catch (err) {
    console.log("Could not connect to MongoDB");
    console.log(err);
  }
};

module.exports = connectToDb;
