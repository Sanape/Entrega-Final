const resetPasswordForm = document.getElementById("resetPasswordForm");
const back = document.getElementById("back");
const url = window.location.href;
const token = url.replace("https://curso-coder-backend-production.up.railway.app/resetPassword/", "");
const messagesSection = document.getElementById("messagesSection");

resetPasswordForm.onsubmit = async (e) => {
  e.preventDefault();
  let newPassword = {
    password: document.getElementById("password").value,
  };

  await resetPassword(newPassword);
};

async function resetPassword(password) {
  try {
    validateResetPasswordForm(password);

    const result = await axios.post(
      `https://curso-coder-backend-production.up.railway.app/api/users/resetPassword/${token}`,
      password
    );

    messagesSection.innerHTML = result.data.message;
  } catch (err) {
    if (
      err.response &&
      err.response.data.Error === "Reset password token expired"
    ) {
      location.href = "https://curso-coder-backend-production.up.railway.app/forgotPassword";
    } else if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

function validateResetPasswordForm(passwordForm) {
  if (!passwordForm.password) {
    throw new Error("Form incomplete");
  }

  if (
    passwordForm.password != document.getElementById("confirm_password").value
  ) {
    throw new Error("Confirm password do not match");
  }

  if (!token) {
    throw new Error(
      "There is no token, go to https://curso-coder-backend-production.up.railway.app/forgotPassword to sent an email to change your password"
    );
  }
}
