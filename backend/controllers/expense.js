const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");

exports.addExpense = async (req, res, next) => {
  const { amount, desc, category } = req.body;
  const t = await sequelize.transaction();
  try {
    const [expense] = await Promise.all([
      await req.user.createExpense(
        {
          amount: amount,
          desc: desc,
          category: category,
        },
        { transaction: t }
      ),
      await req.user.update(
        {
          totalExpense: req.user.totalExpense + +amount,
        },
        { transaction: t }
      ),
    ]);
    t.commit();
    res.json(expense.dataValues);
  } catch (err) {
    await t.rollback();
    console.log(err);
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
  const t = await sequelize.transaction();
  try {
    const expense = await req.user.getExpenses(
      { where: { id: id } },
      { transaction: t }
    );
    await req.user.update(
      {
        totalExpense: req.user.totalExpense - +expense[0].amount,
      },
      { transaction: t }
    );
    await expense[0].destroy({ transaction: t });
    t.commit();
    res.json({
      message: "Expense deleted",
    });
  } catch (err) {
    t.rollback();
    res.status(404).json({
      message: "Expense not found, try again",
    });
  }
};
