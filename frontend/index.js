const baseUrl = "http://localhost:3000";

const form = document.getElementById("signUpForm");
const msg = document.getElementById("message");

const messageHandler = (message, type) => {
  msg.innerText = message;
  msg.className = type;
  setTimeout(() => {
    msg.innerText = "";
    msg.className = "";
  }, 3000);
};

const submitHandler = async (e) => {
  e.preventDefault();
  const userName = e.target.userName;
  const email = e.target.email;
  const password = e.target.password;
  if (userName.value === "" || email.value === "" || password.value === "") {
    messageHandler("Please Enter all the fields", "error");
  } else {
    let userDetails = {
      userName: userName.value,
      email: email.value,
      password: password.value,
    };
    try {
      const response = await axios.post(`${baseUrl}/user/sign-up`, userDetails);
      messageHandler("Signup successfull", "success");
      userName.value = "";
      email.value = "";
      password.value = "";
    } catch (err) {
      messageHandler(`Something Went wrong: ${err.message}`, "error");
    }
  }
};

form.addEventListener("submit", submitHandler);
