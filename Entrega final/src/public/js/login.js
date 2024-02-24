const loginForm = document.getElementById("loginForm");
const back = document.getElementById("back");

back.onclick = (e) => {
  window.history.back();
};

loginForm.onsubmit = async (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  await login(user);
};

async function login(user) {
  try {
    validateUserForm(user);

    const result = await axios.post(
      "https://curso-coder-backend-production.up.railway.app/api/sessions/login",
      user
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

function validateUserForm(user) {
  if (!user.email || !user.password) {
    throw new Error("Form incomplete");
  }
}
