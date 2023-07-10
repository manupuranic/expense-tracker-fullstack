const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.use("/user", userRouter);
app.use("/expenses", expenseRouter);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port: 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
