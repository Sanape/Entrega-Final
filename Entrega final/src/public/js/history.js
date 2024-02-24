const listCarts = document.getElementById("listCarts");
const urlString = window.location.search;
const urlParams = new URLSearchParams(urlString);
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
let href = "https://curso-coder-backend-production.up.railway.app/history";

function compileHistory(carts) {
  const cartsTemplate = carts.map(
    (cart) => `
      <a href="https://curso-coder-backend-production.up.railway.app/carts/${cart.id}" class="h-fit">
      <div class="p-3 flex items-center justify-between border border-solid border-indigo-500 bg-indigo-50">
      <p class="text-sm secondary-font">ID: ${cart.id}</p>
      <p class="text-sm secondary-font">Code: ${cart.code}</p>
      <p class="text-sm secondary-font">Purchased products: ${
        cart.products.length
      }</p>
      <p class="text-sm secondary-font">Total amount: ${cart.amount} USD</p>
      <p class="text-sm secondary-font">Purchased: ${new Date(
        cart.updatedAt
      ).toLocaleDateString()}</p>
      </div>
      </a>
      `
  );

  listCarts.innerHTML = "";

  cartsTemplate.forEach((template) => {
    listCarts.innerHTML = listCarts.innerHTML + template;
  });
}

async function getHistory() {
  try {
    let url = "https://curso-coder-backend-production.up.railway.app/api/carts/history?";

    startDate.value = urlParams.get("startDate");
    endDate.value = urlParams.get("endDate");

    if (urlParams.size > 0) {
      for (let [key, value] of urlParams) {
        url = url + key + "=" + value + "&";
      }
    }

    url = url.slice(0, url.length - 1);

    let response;
    if (Cookies.get("token")) {
      response = await axios.get(url, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      response = await axios.get(url);
    }

    compileHistory(response.data.message);
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

getHistory();

startDate.onchange = (e) => {
  e.preventDefault();

  if (endDate.value) {
    location.href = href + "&startDate=" + startDate.value;
  } else {
    href = href + "?startDate=" + startDate.value;
  }
};

endDate.onchange = (e) => {
  e.preventDefault();

  if (startDate.value) {
    location.href = href + "&endDate=" + endDate.value;
  } else {
    href = href + "?endDate=" + endDate.value;
  }
};
