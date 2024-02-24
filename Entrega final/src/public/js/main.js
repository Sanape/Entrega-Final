const socketClient = io();
const actualYear = document.getElementById("actualYear");
actualYear.innerHTML = new Date().getFullYear();
const searchBar = document.getElementById("searchBar");
const cart = document.getElementById("cart");
cart.href = "https://curso-coder-backend-production.up.railway.app/login";
let cartId = 0;
const login_section = document.getElementById("login-section");
const authenticated = Cookies.get("token") || Cookies.get("user");
const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
const sections = document.getElementById("sections");

login_section.innerHTML =
  authenticated && user
    ? `
    <span class="flex items-center justify-center gap-x-5">
      <p
        class="text-white secondary-font cursor-pointer"
        onclick="logout();"
      >Logout</p>
      <a href="https://curso-coder-backend-production.up.railway.app/profile">
        <img src="${user.profilePhoto}" class="w-10 h-10 border-2 rounded-full border-orange-600 border-solid" />
      </a>
    </span>
      `
    : `<a
        href="https://curso-coder-backend-production.up.railway.app/login"
        class="text-white secondary-font"
      >Login</a>
      <p class="text-white">|</p>
      <a
        href="https://curso-coder-backend-production.up.railway.app/register"
        class="text-white secondary-font"
      >Register</a>`;

if (authenticated && user && user.role === "ADMIN") {
  sections.innerHTML =
    sections.innerHTML +
    "<a href='https://curso-coder-backend-production.up.railway.app/realtimeProducts' class='secondary-font text-indigo-500 hover:bg-orange-600 px-4 py-2 hover:text-white'>Product Panel</a>";
  sections.innerHTML =
    sections.innerHTML +
    "<a href='https://curso-coder-backend-production.up.railway.app/realtimeCategories' class='secondary-font text-indigo-500 hover:bg-orange-600 px-4 py-2 hover:text-white'>Category Panel</a>";
  sections.innerHTML =
    sections.innerHTML +
    "<a href='https://curso-coder-backend-production.up.railway.app/realtimeDevelopers' class='secondary-font text-indigo-500 hover:bg-orange-600 px-4 py-2 hover:text-white'>Developer Panel</a>";
}

async function getCartOfCurrentUser() {
  try {
    let response;

    if (Cookies.get("token")) {
      response = await axios.get("https://curso-coder-backend-production.up.railway.app/api/carts/", {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      response = await axios.get("https://curso-coder-backend-production.up.railway.app/api/carts/");
    }

    cartId = response.data.message.id;

    Cookies.set("cartId", cartId);

    cart.href = `https://curso-coder-backend-production.up.railway.app/carts/${cartId}`;
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

if (authenticated) {
  getCartOfCurrentUser();
}

searchBar.onkeyup = (e) => {
  e.preventDefault();
  if (e.keyCode === 13 && searchBar.value) {
    location.href = `https://curso-coder-backend-production.up.railway.app/products?filter=keyword&filterValue=${searchBar.value}&page=1`;
  }
};

function myFunction(bought) {
  var x = document.getElementById("snackbar");
  x.innerHTML = `
  <img src="${
    bought.product.url_front_page
  }" style="width:70px; height:100px" class="rounded-md"/>
  <span class="flex flex-col gap-y-3">
  <p class="primary-font text-sm"><span>${
    bought.fullname
  }</span> bought a new product</p>
<p class="secondary-font text-xs">${bought.product.title}</p>
<p class="secondary-font text-xs"><b>Total: </b>${
    bought.product.price * (1 - bought.product.discount / 100)
  } USD</p>
</span>
  `;
  x.className =
    "show flex gap-x-3 border-2 border-solid border-indigo-500 bg-indigo-50 p-4 rounded-md";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 5000);
}

socketClient.on("newBought", (bought) => {
  myFunction(bought);
});

async function logout() {
  try {
    const token = Cookies.get("token");

    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("cartId");

    if (token) {
      await axios.delete("https://curso-coder-backend-production.up.railway.app/api/sessions/", {
        headers: {
          Authorization: token,
        },
      });
    } else {
      await axios.delete("https://curso-coder-backend-production.up.railway.app/api/sessions/");
    }

    location.href = "https://curso-coder-backend-production.up.railway.app/login";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}
