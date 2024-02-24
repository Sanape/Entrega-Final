const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const back = document.getElementById("back");
const messagesSection = document.getElementById("messagesSection");

back.onclick = (e) => {
  window.history.back();
};

forgotPasswordForm.onsubmit = async (e) => {
  e.preventDefault();
  let email = {
    email: document.getElementById("email").value,
  };

  await forgotPassword(email);
};

async function forgotPassword(email) {
  try {
    validateForgotPasswordForm(email);

    const result = await axios.post(
      "https://curso-coder-backend-production.up.railway.app/api/users/forgotPassword",
      email
    );

    messagesSection.innerHTML = result.data.message;
  } catch (err) {
    alert(`${err.response.data.Error}`);
  }
}

function validateForgotPasswordForm(form) {
  if (!form.email) {
    throw new Error("Form incomplete");
  }
}
