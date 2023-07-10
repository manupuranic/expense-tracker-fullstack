const baseUrl = "http://localhost:3000/expenses";

const msg = document.getElementById("message");
const form = document.getElementById("addExpense");
const expenseList = document.getElementById("expenses");

const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 5000);
};

const displayExpenses = (exp) => {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const editBtn = document.createElement("button");

  const spanAmount = document.createElement("span");
  const spanDesc = document.createElement("span");
  const spanCategory = document.createElement("span");
  const symbol = document.createElement("span");

  li.className = "list-group-item";
  li.id = exp.id;
  delBtn.className = "btn btn-danger li-btn delete";
  editBtn.className = "btn btn-dark li-btn edit";
  spanAmount.className = "span-amount";
  spanCategory.className = "span-category";
  spanDesc.className = "span-desc";
  symbol.className = "symbol";

  spanAmount.appendChild(document.createTextNode(exp.amount));
  spanDesc.appendChild(document.createTextNode(exp.desc));
  spanCategory.appendChild(document.createTextNode(exp.category));
  symbol.appendChild(document.createTextNode("₹"));

  delBtn.appendChild(document.createTextNode("Delete"));
  editBtn.appendChild(document.createTextNode("Edit"));

  delBtn.addEventListener("click", deleteHandler);
  editBtn.addEventListener("click", editHandler);

  li.appendChild(symbol);
  li.appendChild(spanAmount);
  li.appendChild(spanDesc);
  li.appendChild(spanCategory);
  li.appendChild(delBtn);
  li.appendChild(editBtn);

  expenseList.appendChild(li);
};

const getExpenses = async () => {
  expenseList.replaceChildren();
  try {
    const res = await axios.get(baseUrl);
    const expenses = res.data;
    expenses.forEach((exp) => {
      displayExpenses(exp);
    });
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener("DOMContentLoaded", getExpenses);

const submitHandler = async (e) => {
  e.preventDefault();
  let amount = document.getElementById("amount");
  let desc = document.getElementById("desc");
  let category = document.getElementById("category");

  let expList = {
    amount: amount.value,
    desc: desc.value,
    category: category.value,
  };
  console.log(expList);
  // localStorage.setItem(desc.value, JSON.stringify(expList));
  let editId = document.querySelector(".submit-btn").id;
  if (editId !== "") {
    try {
      const res = await axios.post(
        `${baseUrl}/edit-expense/${editId}`,
        expList
      );
      getExpenses();
      document.querySelector(".submit-btn").id = "";
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const exp = await axios.post(`${baseUrl}/add-expense`, expList);
      displayExpenses(exp.data);
      messageHandler("Expense Added Successfully", "success");
    } catch (err) {
      messageHandler(err, "error");
    }
  }

  desc.value = "";
  amount.value = "";
  category.value = "Food";
};

const deleteHandler = async (e) => {
  const li = e.target.parentElement;
  const id = li.id;
  console.log(id);
  try {
    const res = await axios.delete(`${baseUrl}/delete-expense/${id}`);
    expenseList.removeChild(li);
    messageHandler("Expense Deleted", "success");
  } catch (err) {
    messageHandler(err, "error");
  }
  // localStorage.removeItem(desc);
};

const editHandler = (e) => {
  const li = e.target.parentElement;
  const desc = li.querySelector(".span-desc").textContent;
  const amount = li.querySelector(".span-amount").textContent;
  const category = li.querySelector(".span-category").textContent;
  document.querySelector(".submit-btn").id = li.id;

  document.getElementById("desc").value = desc;
  document.getElementById("expense").value = amount;
  document.getElementById("category").value = category;
};

form.addEventListener("submit", submitHandler);
