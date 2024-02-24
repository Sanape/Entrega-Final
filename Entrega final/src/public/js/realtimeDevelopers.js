const socketClientAdmin = io();
const listDevelopers = document.getElementById("listDevelopers");
const back = document.getElementById("back");
const createDeveloperForm = document.getElementById("createDeveloperForm");
const deleteDeveloperForm = document.getElementById("deleteDeveloperForm");

async function createDeveloper(newData) {
  try {
    if (!newData.developer_name) {
      throw new Error("Form incomplete");
    }

    if (Cookies.get("token")) {
      await axios.post("https://curso-coder-backend-production.up.railway.app/api/developers/", newData, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.post("https://curso-coder-backend-production.up.railway.app/api/developers/", newData);
    }

    socketClientAdmin.emit("getAllDevelopers");

    const section = document.getElementById(
      "createDeveloperFormMessageSection"
    );

    section.innerText = "Developer created successfully";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function deleteDeveloper(id) {
  try {
    if (!id) {
      throw new Error("Form incomplete");
    }

    if (Cookies.get("token")) {
      await axios.delete(`https://curso-coder-backend-production.up.railway.app/api/developers/${id}`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.delete(`https://curso-coder-backend-production.up.railway.app/api/developers/${id}`);
    }

    socketClientAdmin.emit("getAllDevelopers");

    const section = document.getElementById(
      "deleteDeveloperFormMessageSection"
    );

    section.innerText = "Developer deleted successfully";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}
back.onclick = (e) => {
  window.history.back();
};

socketClientAdmin.emit("getAllDevelopers");

function compileDevelopers(developers) {
  const developersTemplate = developers.map(
    (developer) => `
      <a href="https://curso-coder-backend-production.up.railway.app/developers/${developer.id}" class="w-full">
      <div class="p-2 flex items-center gap-x-3 border border-solid border-indigo-500 bg-indigo-50">
      <p class="text-sm secondary-font">ID: ${developer.id}</p>
      <p class="text-sm secondary-font">${developer.developer_name}</p>
      </div>
      </a>
      `
  );

  listDevelopers.innerHTML = "";

  developersTemplate.forEach((template) => {
    listDevelopers.innerHTML = listDevelopers.innerHTML + template;
  });
}
socketClientAdmin.on("updatedDevelopers", (developers) => {
  compileDevelopers(developers);
});

createDeveloperForm.onsubmit = async (e) => {
  e.preventDefault();

  const developer = {
    developer_name: document.getElementById("createDeveloperName").value,
  };

  await createDeveloper(developer);
};

deleteDeveloperForm.onsubmit = async (e) => {
  e.preventDefault();

  await deleteDeveloper(+document.getElementById("deleteDeveloperId").value);
};
