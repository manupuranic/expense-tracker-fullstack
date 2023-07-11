const baseUrl = "http://localhost:3000/expenses";

const msg = document.getElementById("message");
const form = document.getElementById("addExpense");
const expenseList = document.getElementById("expenses");
const premiumBtn = document.getElementById("premium-btn");
const logout = document.getElementById("logout");

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../login/login.html";
}

logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "../login/login.html";
});

document.getElementById("premium-btn").addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    {
      headers: {
        Authentication: token,
      },
    }
  );
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          success: true,
        },
        { headers: { Authentication: token } }
      );
      getExpenses();
      alert("You are now a Premium User!");
    },
  };

  const rzpy = new Razorpay(options);
  rzpy.open();
  e.preventDefault();

  rzpy.on("payment.failed", async function (response) {
    console.log(response);

    await axios.post(
      "http://localhost:3000/purchase/updatetransactionstatus",
      {
        order_id: options.order_id,
        sucess: false,
      },
      { headers: { Authentication: token } }
    );
    alert("something went wrong!!");
  });
});

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

const displayPremiumButton = async () => {
  try {
    const response = await axios.get("http://localhost:3000/user", {
      headers: { Authentication: token },
    });
    if (response.data.isPremium) {
      premiumBtn.style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
};

const getExpenses = async () => {
  expenseList.replaceChildren();
  displayPremiumButton();
  // const token = localStorage.getItem("token");
  try {
    const res = await axios.get(baseUrl, {
      headers: { Authentication: token },
    });
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
  const token = localStorage.getItem("token");
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
        expList,
        { headers: { Authentication: token } }
      );
      getExpenses();
      document.querySelector(".submit-btn").id = "";
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const exp = await axios.post(`${baseUrl}/add-expense`, expList, {
        headers: { Authentication: token },
      });
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
  const token = localStorage.getItem("token");
  try {
    const res = await axios.delete(`${baseUrl}/delete-expense/${id}`, {
      headers: { Authentication: token },
    });
    expenseList.removeChild(li);
    messageHandler("Expense Deleted", "success");
  } catch (err) {
    messageHandler(err, "error");
  }
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
