const Expense = require("../models/expense");
const User = require("../models/user");

exports.getLeaderboards = async (req, res, next) => {
  const expenses = await Expense.findAll({
    attributes: ["amount", "userId"],
  });
  const users = await User.findAll({
    attributes: ["id", "userName"],
  });
  const expenseAggregate = {};
  expenses.forEach((expense) => {
    if (expenseAggregate[expense.userId]) {
      expenseAggregate[expense.userId] += expense.amount;
    } else {
      expenseAggregate[expense.userId] = expense.amount;
    }
  });
  const leaderboard = [];
  users.forEach((user) => {
    leaderboard.push({
      name: user.userName,
      totalExpense: expenseAggregate[user.id],
    });
  });
  leaderboard.sort((a, b) => b.totalExpense - a.totalExpense);
  res.json(leaderboard);
};
