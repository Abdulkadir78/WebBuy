const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "./src/config/dev.env" });

const connectToDb = require("./db/connection");
const userRouter = require("./routers/users");
const productRouter = require("./routers/products");
const orderRouter = require("./routers/orders");
const { notFound, errorHandler } = require("./middleware/errors");

const PORT = process.env.PORT || 5000;
const app = express();

const expressJson = express.json({
  verify: function (req, res, buf) {
    // stripe webhook needs raw request body
    if (req.originalUrl.startsWith("/api/orders/webhook")) {
      req.rawBody = buf.toString();
    }
  },
});

app.use(expressJson);
app.use(cors());

connectToDb(app); // emits 'ready' when connected to database

app.on("ready", () => {
  // app routers
  app.use("/api/users", userRouter);
  app.use("/api/products", productRouter);
  app.use("/api/orders", orderRouter);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../", "client", "build")));

    app.get("*", (req, res) =>
      res.sendFile(
        path.resolve(__dirname, "../", "client", "build", "index.html")
      )
    );
  } else {
    app.get("/", (req, res) => {
      res.send("Server is up and running...");
    });
  }

  // handle errors
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
});
