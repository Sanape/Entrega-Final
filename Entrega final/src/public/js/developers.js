const developers = document.getElementById("developers");

function compileDevelopers(_developers) {
    _developers.forEach((developer) => {
    developers.innerHTML =
      developers.innerHTML +
      `
            <a href="https://curso-coder-backend-production.up.railway.app/developers/${developer.id}">
        <div class="p-3 flex items-center gap-x-3 border border-solid border-indigo-500 bg-indigo-50 rounded-md">
        <img src="${developer.url_logo_developer}" style="width:100px;height:60px;"/>
        <p class="text-xl secondary-font">${developer.developer_name}</p>
        </div>
        </a>
            </a>
          `;
  });
}

async function getDevelopers() {
  try {
    const response = await axios.get("https://curso-coder-backend-production.up.railway.app/api/developers");

    console.log(response)

    compileDevelopers(response.data.message);
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

getDevelopers();
