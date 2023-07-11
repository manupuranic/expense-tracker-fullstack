const Expense = require("../models/expense");

exports.addExpense = async (req, res, next) => {
  const { amount, desc, category } = req.body;
  try {
    const expense = await req.user.createExpense({
      amount: amount,
      desc: desc,
      category: category,
    });
    res.json(expense.dataValues);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    // const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    const expenses = await req.user.getExpenses();
    res.json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    const expense = await req.user.getExpenses({ where: { id: id } });
    await expense[0].destroy();
    res.json({
      message: "Expense deleted",
    });
  } catch (err) {
    res.status(404).json({
      message: "Expense not found, try again",
    });
  }
};
