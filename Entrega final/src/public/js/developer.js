let developerID = document.getElementById("developerId");
developerID = +developerID.innerText.replace("ID developer: ", "");
const developerHero = document.getElementById("developerHero");
const developerProducts = document.getElementById("developerProducts");
const developerConfiguration = document.getElementById(
  "developerConfiguration"
);
const authUser = Cookies.get("token") || Cookies.get("user");
const userInformation = Cookies.get("user")
  ? JSON.parse(Cookies.get("user"))
  : null;
const developerImg = document.getElementById("developerImg");
const updateDeveloperPhoto = document.getElementById("updateDeveloperPhoto");
const updateDeveloperForm = document.getElementById("updateDeveloperForm");
const updateDeveloperName = document.getElementById("updateDeveloperName");

if (authUser && userInformation && userInformation.role === "ADMIN") {
  developerConfiguration.style = "display:contents;";
} else {
  developerConfiguration.style = "display:none;";
}

updateDeveloperForm.onsubmit = async (e) => {
  try {
    e.preventDefault();
    const newData = {
      developer_name: updateDeveloperName.value,
    };

    if (!newData.developer_name) {
      throw new Error(`Form incomplete`);
    }

    await updateDeveloper(newData);
  } catch (error) {
    alert(error);
  }
};

async function getDeveloper() {
  try {
    let response;

    if (Cookies.get("token")) {
      response = await axios.get(
        `https://curso-coder-backend-production.up.railway.app/api/developers/${developerID}`,
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
    } else {
      response = await axios.get(
        `https://curso-coder-backend-production.up.railway.app/api/developers/${developerID}`
      );
    }

    await compileDeveloper(response.data.message);
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

updateDeveloperPhoto.onchange = (e) => {
  e.preventDefault();
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const newUserInfo = new FormData();

      newUserInfo.append("file", file);

      developerImg.src = e.target.result;

      await updateDeveloper(newUserInfo);
    };
    reader.readAsDataURL(file);
  }
};

async function updateDeveloper(newData) {
  try {
    if (Cookies.get("token")) {
      await axios.put(
        `https://curso-coder-backend-production.up.railway.app/api/developers/${developerID}`,
        newData,
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
    } else {
      await axios.put(
        `https://curso-coder-backend-production.up.railway.app/api/developers/${developerID}`,
        newData
      );
    }

    window.location.reload();
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function compileDeveloper(developer) {
  updateDeveloperName.value = developer.developer_name;

  developerImg.src = developer.url_logo_developer;
  const developerHeroTemplate = `
  <p class="text-5xl primary-font leading-normal">${developer.developer_name}</p>
  <img src="${developer.url_logo_developer}"/>

  <p class="text-3xl primary-font leading-normal">Catalogue:</p>
  `;

  developerHero.innerHTML = developerHeroTemplate;

  const productsTemplate = developer.products.map(
    (product) => `
      <a href="https://curso-coder-backend-production.up.railway.app/products/${product.id}">
      <div class="flex flex-col justify-center items-center relative" style="width:200px;height:350px;" >
      <div style="width:50px;height:50px;display:${
        +product.discount ? "flex" : "none"
      }" class="absolute bottom-[60px] right-[-10px] rounded-full bg-orange-600 items-center justify-center ">
        <p class="text-md text-white secondary-font mb-1">-${
          product.discount
        }%</p> 
      </div>
      <img src="${
        product.url_front_page
      }" style="width:200px;height:270px;" class="rounded-t-lg"/>
      <div class="rounded-b-lg bg-white p-2 flex flex-col justify-center items-center" style="width:200px;height:80px;">
      <p class="text-center primary-font">${product.title}</p>
      <span class="w-full flex gap-x-2 items-center justify-center">
      <p class="${
        product.discount
          ? "line-through text-slate-500 text-sm secondary-font"
          : "text-sm secondary-font"
      }">${product.price} USD</p>
      <p class="text-sm secondary-font">${
        product.discount
          ? (+product.price * (1 - +product.discount / 100)).toFixed(2) + " USD"
          : ""
      }</p>
      </span>
      </div>
      <div/>
      </a>
      `
  );

  productsTemplate.forEach((template) => {
    developerProducts.innerHTML = developerProducts.innerHTML + template;
  });
}

getDeveloper();
