const baseUrl = "http://localhost:3000";

const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("message");

const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 5000);
};

const loginHandler = async (e) => {
  e.preventDefault();
  const email = e.target.email;
  const password = e.target.password;
  if (email.value === "" || password.value === "") {
    messageHandler("Please Enter all the fields", "error");
  } else {
    let userDetails = {
      email: email.value,
      password: password.value,
    };
    try {
      const response = await axios.post(`${baseUrl}/user/login`, userDetails);
      const data = response.data;
      messageHandler(data.message, "success");
      localStorage.setItem("token", data.token);
      localStorage.setItem("perPage", 5);
      window.location.href = "../expenses/expenses.html";
      email.value = "";
      password.value = "";
    } catch (err) {
      if (err.response.status === 401) {
        messageHandler("Password do not match. Try again", "error");
      } else {
        messageHandler("User does not exist!", "error");
      }
    }
  }
};

loginForm.addEventListener("submit", loginHandler);
