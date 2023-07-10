const Expense = require("../models/expense");

exports.addExpense = async (req, res, next) => {
  const { amount, desc, category } = req.body;
  try {
    const expense = await Expense.create({
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
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findByPk(id);
    await expense.destroy();
    res.json({
      message: "Expense deleted",
    });
  } catch (err) {
    res.status(404).json({
      message: "Expense not found, try again",
    });
  }
};
