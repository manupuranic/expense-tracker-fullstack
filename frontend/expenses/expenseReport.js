const downloadBtn = document.getElementById("download-btn");
const token = localStorage.getItem("token");
const premiumBtn = document.getElementById("premium-btn");
const premiumInfo = document.getElementById("premium-info");
const showLeaderboardBtn = document.getElementById("showLeaderboard");

console.log(downloadBtn.classList);

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
    downloadBtn.classList.remove("disabled");
  }
};

premiumFeatures();
