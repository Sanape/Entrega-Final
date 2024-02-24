const userInfo = JSON.parse(Cookies.get("user"));
const updateProfileForm = document.getElementById("updateProfileForm");
const profilePhoto = document.getElementById("profilePhoto");
profilePhoto.src = userInfo.profilePhoto;
const inputProfilePhoto = document.getElementById("inputProfilePhoto");
const first_name = document.getElementById("first_name");
const last_name = document.getElementById("last_name");
const role = document.getElementById("role");
const deleteAccountDialogButton = document.getElementById(
  "deleteAccountDialogButton"
);
const profileDialog = document.getElementById("profileDialog");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const deleteButton = document.getElementById("deleteButton");
const roleForm = document.getElementById("roleForm");

deleteAccountDialogButton.onclick = (e) => {
  e.preventDefault();
  profileDialog.showModal();
};

cancelDeleteButton.onclick = (e) => {
  e.preventDefault();
  profileDialog.close();
};

deleteButton.onclick = async (e) => {
  e.preventDefault();
  await deleteCurrentUser();
};

first_name.value = userInfo.firstName;
last_name.value = userInfo.lastName;
role.innerText = `Role: ${userInfo.role}`;

if (userInfo.role === "USER") {
  roleForm.innerHTML = `
  <span class="flex flex-col  justify-center items-center gap-y-5">
  <input type="file" name="documentation" id="documentation" accept=".pdf" />
  <p class='text-center w-3/5'>Want to be an admin? Upload the following documentation in pdf format and with the exact same name: "Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"</p>
  <input
      type="submit"
      value="Change role"
      class="p-2 bg-orange-600 secondary-font text-white rounded-md text-sm cursor-pointer"
    />
    </span>
  `;

  const documentation = document.getElementById("documentation");

  documentation.onchange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const documentation = new FormData();

        documentation.append("file", file);

        await uploadDocumentation(documentation);
      };
      reader.readAsDataURL(file);
    }
  };
} else {
  roleForm.innerHTML = `
  <span class="flex flex-col  justify-center items-center gap-y-5">
  <input
      type="submit"
      value="Change role"
      class="p-2 bg-orange-600 secondary-font text-white rounded-md text-sm cursor-pointer"
    />
    </span>
  `;
}

inputProfilePhoto.onchange = (e) => {
  e.preventDefault();
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const newUserInfo = new FormData();

      newUserInfo.append("file", file);

      profilePhoto.src = e.target.result;

      await updateUser(newUserInfo);
    };
    reader.readAsDataURL(file);
  }
};

async function getCurrentUser() {
  try {
    const result = await axios.get(
      `https://curso-coder-backend-production.up.railway.app/api/sessions/current`
    );

    Cookies.remove("user");
    Cookies.set("user", JSON.stringify(result.data.message));
    window.location.reload();
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

updateProfileForm.onsubmit = async (e) => {
  try {
    e.preventDefault();
    let newData = {
      first_name: document.getElementById("first_name").value,
      last_name: document.getElementById("last_name").value,
    };

    validateUserForm(newData);

    await updateUser(newData);
  } catch (error) {
    alert(error);
  }
};

roleForm.onsubmit = async (e) => {
  try {
    e.preventDefault();

    await changeRole();
  } catch (error) {
    alert(error);
  }
};

async function changeRole() {
  try {
    let result;
    if (Cookies.get("token")) {
      result = await axios.put(
        "https://curso-coder-backend-production.up.railway.app/api/users/admin/" + userInfo.id,
        {},
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
    } else {
      result = await axios.put(
        "https://curso-coder-backend-production.up.railway.app/api/users/admin/" + userInfo.id,
        {}
      );
    }

    Cookies.remove("token");
    Cookies.remove("user");

    location.href = "https://curso-coder-backend-production.up.railway.app/";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function uploadDocumentation(data) {
  try {
    let result;
    if (Cookies.get("token")) {
      result = await axios.post(
        "https://curso-coder-backend-production.up.railway.app/api/users/documents",
        data,
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
    } else {
      result = await axios.post(
        "https://curso-coder-backend-production.up.railway.app/api/users/documents",
        data
      );
    }

    alert(result.data.message);
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function updateUser(newData) {
  try {
    if (Cookies.get("token")) {
      await axios.put("https://curso-coder-backend-production.up.railway.app/api/users/", newData, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.put("https://curso-coder-backend-production.up.railway.app/api/users/", newData);
    }

    await getCurrentUser();
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function deleteCurrentUser() {
  try {
    if (Cookies.get("token")) {
      await axios.delete("https://curso-coder-backend-production.up.railway.app/api/users/", {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.delete("https://curso-coder-backend-production.up.railway.app/api/users/");
    }

    Cookies.remove("token");
    Cookies.remove("user");

    location.href = "https://curso-coder-backend-production.up.railway.app/";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

function validateUserForm(newUser) {
  if (!newUser.first_name || !newUser.last_name) {
    throw new Error("Form incomplete");
  }
}
