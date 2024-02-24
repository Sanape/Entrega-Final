const socketclient = io();
const productOfCart = document.getElementById("productOfCart");
const totalAmount = document.getElementById("totalAmount");
let cartID = document.getElementById("cartId");
cartID = +cartID.innerText.replace("ID cart: ", "");
const buyButton = document.getElementById("buyButton");
let _products;

async function deleteProductFromCart(idProduct) {
  try {
    if (Cookies.get("token")) {
      await axios.delete(
        `https://curso-coder-backend-production.up.railway.app/api/carts/${cartID}/product/${idProduct}`,
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
    } else {
      await axios.delete(
        `https://curso-coder-backend-production.up.railway.app/api/carts/${cartID}/product/${idProduct}`
      );
    }

    location.reload();
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function buyCart() {
  try {
    if (Cookies.get("token")) {
      await axios.put(`https://curso-coder-backend-production.up.railway.app/api/carts/${cartID}/buy`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.put(`https://curso-coder-backend-production.up.railway.app/api/carts/${cartID}/buy`);
    }

    let randomNumber = Math.round(Math.random() * (_products.length - 1));

    socketclient.emit(
      "productBuy",
      JSON.parse(Cookies.get("user")),
      _products[randomNumber]
    );

    location.href = "https://curso-coder-backend-production.up.railway.app";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

function compileProducts(products) {
  _products = products;
  let finalPrice = 0;
  for (let product of products) {
    finalPrice += +product.price * (1 - +product.discount / 100);
  }
  totalAmount.innerText =
    totalAmount.innerText + " " + finalPrice.toFixed(2) + " USD";

  if (products.length > 0) {
    const productsTemplate = products.map(
      (product) => `
        <div class="rounded-md p-5 flex items-center gap-x-3 border-2 border-solid border-indigo-500 bg-indigo-50">
        <a href="https://curso-coder-backend-production.up.railway.app/products/${product.id}">
        <img src="${
          product.url_front_page
        }" class="rounded-md" style="width:80px;height:120px;"/>
        </a>
        <p class="text-sm secondary-font">ID: ${product.id}</p>
        <p class="text-sm secondary-font">Title: ${product.title}</p>
        <p class="text-sm secondary-font">Price: ${product.price} USD</p>
        <p class="text-sm secondary-font">Discount: ${product.discount}%</p>
        <p class="text-sm secondary-font">Final price: ${(
          +product.price *
          (1 - +product.discount / 100)
        ).toFixed(2)} USD</p>
        <i class="fa-solid fa-trash-can cursor-pointer hover:text-red-500" onclick="deleteProductFromCart(${
          product.id
        })"></i>
        </div>
        `
    );

    productOfCart.innerHTML = "";

    productsTemplate.forEach((template) => {
      productOfCart.innerHTML = productOfCart.innerHTML + template;
    });
  } else {
    productOfCart.innerHTML = `<p class="text-2xl text-white secondary-font pl-5 pt-5">No products added yet</p>`;
  }
}

async function getCartById() {
  try {
    let response;

    if (Cookies.get("token")) {
      response = await axios.get(`https://curso-coder-backend-production.up.railway.app/api/carts/${cartID}`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      response = await axios.get(`https://curso-coder-backend-production.up.railway.app/api/carts/${cartID}`);
    }

    if (response.data.message.bought) {
      buyButton.disabled = true;
      buyButton.className =
        "w-full px-3 py-2 bg-gray-600 secondary-font text-white rounded-md text-sm";
    }

    compileProducts(response.data.message.products);
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

getCartById();
