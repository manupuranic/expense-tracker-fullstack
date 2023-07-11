const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./utils/database");
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expenses");
const purchaseRouter = require("./routes/purchase");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));

app.use("/user", userRouter);
app.use("/expenses", expenseRouter);
app.use("/purchase", purchaseRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

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
