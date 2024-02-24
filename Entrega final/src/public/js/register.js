const registerForm = document.getElementById("registerForm");
const back = document.getElementById("back");

back.onclick = (e) => {
  window.history.back();
};

registerForm.onsubmit = async (e) => {
  e.preventDefault();
  let newUser = {
    email: document.getElementById("email").value,
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    password: document.getElementById("password").value,
  };

  await register(newUser);
};

async function register(newUser) {
  try {
    validateUserForm(newUser);

    const result = await axios.post(
      "https://curso-coder-backend-production.up.railway.app/api/sessions/register",
      newUser
    );

    Cookies.set("token", result.data.message.token, { expires: 7 });
    Cookies.set("user", JSON.stringify(result.data.message.user), {
      expires: 7,
    });
    location.href = "https://curso-coder-backend-production.up.railway.app/";
  } catch (err) {
    if(err.response){
      alert(`${err.response.data.Error}`);
    }else{
      alert(err)
    }
  }
}

function validateUserForm(newUser) {
  if (
    !newUser.email ||
    !newUser.password ||
    !newUser.first_name ||
    !newUser.last_name
  ) {
    throw new Error("Form incomplete");
  }

  if (newUser.password != document.getElementById("confirm_password").value) {
    throw new Error("Confirm password do not match");
  }
}
