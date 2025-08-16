const express = require("express");
const cors = require("cors");
const { initFirebase } = require("./config/firebase");
const usersRouter = require("./routes/users.routes");
const healthRouter = require("./routes/health.routes");
const notFound = require("./middlewares/notfound.middleware");
const errorHandler = require("./middlewares/error.middleware");

initFirebase();

const app = express();

// Core middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// Welcome route
app.get("/", (_req, res) => {
  res.send("Welcome to the RentRedi API!");
});

// Feature routes
app.use("/users", usersRouter);
app.use("/health", healthRouter);

// 404 and error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
