const express = require("express");

const expenseController = require("../controllers/expense");

const router = express.Router();

router.post("/add-expense", expenseController.addExpense);

router.delete("/delete-expense/:id", expenseController.deleteExpense);

router.get("/", expenseController.getExpenses);

module.exports = router;
