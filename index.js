require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import Routes
const postsRouter = require("./routes/postsRoute");
const usersRouter = require("./routes/usersRoute");
const tagsRouter = require("./routes/tagsRoute");
const commentsRouter = require("./routes/commentsRoute");
const logiRouter = require("./routes/loginRoute");
const testRouter = require("./routes/testRoute");

// Import middleware
const authenticate = require("./middlewares/authenticate");

// Import database services
const DatabaseClass = require("./DAL/database");

const app = express();
const database = new DatabaseClass(process.env.DATABASE_URL);

app.use(express.json());
app.use(cors());

// Define Routes
app.use("/routes/posts", postsRouter);
app.use("/routes/users", usersRouter);
app.use("/routes/tags", tagsRouter);
app.use("/routes/comments", commentsRouter);
app.use("/routes/login", logiRouter);
app.use("/routes/test", testRouter);

// Start the server
app.listen(5000, () => {
  console.log("App is listening");
  database
    .connect()
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => {
      console.log("Connect have interrupted", err);
    });
});

module.exports = app;
