const baseUrl = "http://localhost:3000/expenses";

const msg = document.getElementById("message");
const form = document.getElementById("addExpense");
const expenseList = document.getElementById("expenses");
const premiumBtn = document.getElementById("premium-btn");
const premiumInfo = document.getElementById("premium-info");
const logout = document.getElementById("logout");
const leaderboardList = document.getElementById("leaderboard-list");
const showLeaderboardBtn = document.getElementById("showLeaderboard");
const leaderboardDiv = document.querySelector(".leaderboard");

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
      const result = await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          success: true,
        },
        { headers: { Authentication: token } }
      );
      const newToken = result.data.token;
      localStorage.setItem("token", newToken);
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

const displayLeaderboard = (user) => {
  const li = document.createElement("li");
  const spanUserName = document.createElement("span");
  const spanTotalExpense = document.createElement("span");
  const symbol = document.createElement("span");
  const amountDiv = document.createElement("div");

  li.className = "list-group-item leaderboard-li";
  spanUserName.className = "span-UserName";
  spanTotalExpense.className = "span-TotalExpense";
  symbol.className = "symbol";
  amountDiv.className = "amount-div";

  spanUserName.appendChild(document.createTextNode(user.name));
  if (user.totalExpense) {
    spanTotalExpense.appendChild(document.createTextNode(user.totalExpense));
  } else {
    spanTotalExpense.appendChild(document.createTextNode(0));
  }

  symbol.appendChild(document.createTextNode("₹"));

  li.appendChild(spanUserName);
  amountDiv.appendChild(symbol);
  amountDiv.appendChild(spanTotalExpense);
  li.appendChild(amountDiv);

  leaderboardList.appendChild(li);
};

const getLeaderboard = async (e) => {
  leaderboardList.replaceChildren();
  try {
    const response = await axios.get(
      "http://localhost:3000/premium/showLeaderboards"
    );
    leaderboardDiv.style.display = "block";
    const leaderboard = response.data;
    leaderboard.forEach((user) => {
      displayLeaderboard(user);
    });
    window.location.href = "#leaderboard-list";
  } catch (err) {
    console.log(err);
  }
};
showLeaderboardBtn.addEventListener("click", getLeaderboard);

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

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const premiumFeatures = async () => {
  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);
  if (decoded.isPremium) {
    premiumBtn.style.display = "none";
    premiumInfo.style.display = "inline";
    showLeaderboardBtn.style.display = "inline";
  }
};

const getExpenses = async () => {
  expenseList.replaceChildren();
  premiumFeatures();
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
