let productID = document.getElementById("productId");
productID = +productID.innerText.replace("ID product: ", "");
const productHero = document.getElementById("productHero");
const productDescription = document.getElementById("productDescription");
const productVideo = document.getElementById("productVideo");
const productConfiguration = document.getElementById("productConfiguration");
const authenticatedUser = Cookies.get("token") || Cookies.get("user");
const userInfo = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
const productImg = document.getElementById("productImg");
const updateProductPhoto = document.getElementById("updateProductPhoto");
const updateProductForm = document.getElementById("updateProductForm");
const updateProductTitle = document.getElementById("updateProductTitle");
const updateProductDescription = document.getElementById(
  "updateProductDescription"
);
const updateProductPrice = document.getElementById("updateProductPrice");
const updateProductDiscount = document.getElementById("updateProductDiscount");
const updateProductReleaseDate = document.getElementById(
  "updateProductReleaseDate"
);
const updateProductVideo = document.getElementById("updateProductVideo");
const updateProductIdDeveloper = document.getElementById(
  "updateProductIdDeveloper"
);
const updateProductCPU = document.getElementById("updateProductCPU");
const updateProductRAM = document.getElementById("updateProductRAM");
const updateProductMemory = document.getElementById("updateProductMemory");
const updateProductGPU = document.getElementById("updateProductGPU");
let added;

if (authenticatedUser && userInfo && userInfo.role === "ADMIN") {
  productConfiguration.style = "display:flex;";
} else {
  productConfiguration.style = "display:none;";
}

async function productAddedToCart() {
  try {
    let response;
    const idCart = Cookies.get("cartId");
    if (Cookies.get("token")) {
      response = await axios.get(
        `https://curso-coder-backend-production.up.railway.app/api/carts/${idCart}/product/${productID}`,
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
    } else {
      response = await axios.get(
        `https://curso-coder-backend-production.up.railway.app/api/carts/${idCart}/product/${productID}`
      );
    }

    added = response.data.message;
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function getProduct() {
  try {
    let response;

    if (Cookies.get("token")) {
      response = await axios.get(
        `https://curso-coder-backend-production.up.railway.app/api/products/${productID}`,
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
    } else {
      response = await axios.get(
        `https://curso-coder-backend-production.up.railway.app/api/products/${productID}`
      );
    }

    await compileProduct(response.data.message);
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

updateProductPhoto.onchange = (e) => {
  e.preventDefault();
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const newUserInfo = new FormData();

      newUserInfo.append("file", file);

      productImg.src = e.target.result;

      await updateProduct(newUserInfo);
    };
    reader.readAsDataURL(file);
  }
};

async function updateProduct(newData) {
  try {
    if (Cookies.get("token")) {
      await axios.put(
        `https://curso-coder-backend-production.up.railway.app/api/products/${productID}`,
        newData,
        {
          headers: {
            Authorization: Cookies.get("token"),
          },
        }
      );
    } else {
      await axios.put(
        `https://curso-coder-backend-production.up.railway.app/api/products/${productID}`,
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

async function addProductToCart() {
  try {
    let newData = {
      cartId: Cookies.get("cartId"),
      productId: +productID,
    };

    if (Cookies.get("token")) {
      await axios.post(`https://curso-coder-backend-production.up.railway.app/api/carts/`, newData, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.post(`https://curso-coder-backend-production.up.railway.app/api/carts/`, newData);
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

async function compileProduct(product) {
  await productAddedToCart();
  const dateObject = new Date(product.release_date);

  const year = dateObject.getFullYear();
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObject.getDate()).slice(-2);

  const formattedDateString = `${year}-${month}-${day}`;

  updateProductTitle.value = product.title;
  updateProductDescription.value = product.description;
  updateProductPrice.value = +product.price;
  updateProductDiscount.value = +product.discount;
  updateProductReleaseDate.value = formattedDateString;
  updateProductVideo.value = product.trailer_video;
  updateProductIdDeveloper.value = +product.developerId;
  updateProductCPU.value = product.CPU;
  updateProductRAM.value = +product.RAM;
  updateProductMemory.value = +product.memory;
  updateProductGPU.value = product.GPU;

  productImg.src = product.url_front_page;
  const productHeroTemplate = `
  <div class="relative h-fit">
  <div style="width:70px;height:70px;display:${
    +product.discount ? "flex" : "none"
  }" class="absolute bottom-[10px] right-[-10px] rounded-full bg-orange-600 items-center justify-center ">
    <p class="text-xl text-white secondary-font mb-1">-${product.discount}%</p> 
  </div>
  <img src="${
    product.url_front_page
  }" style="height:400px;" class="rounded-md" />
  </div>

<div class="flex flex-col gap-y-3">
<p class="text-5xl primary-font leading-normal">${product.title}</p>
<button title="Add product to cart" onclick="addProductToCart()"
${added ? "disabled" : ""}
${
  added
    ? "class='w-fit px-3 py-2 bg-gray-600 secondary-font text-white rounded-md text-sm'"
    : "class='w-fit px-3 py-2 bg-orange-600 secondary-font text-white rounded-md text-sm cursor-pointer'"
}>
${added ? "" : "<i class='fa-solid fa-basket-shopping pr-1'></i>"}
${added ? "Added to cart" : "Add to cart"}
</button>
<p class="text-lg secondary-font">Product purchased by <span class="text-3xl text-orange-600">${
    product.popularity
  }</span> users just like you</p>
<span class="flex gap-x-5">
<p class="${
    product.discount
      ? "text-xl line-through text-slate-500 secondary-font"
      : "text-xl secondary-font"
  }">$${product.price} USD</p>
${
  product.discount
    ? "<p class='text-xl secondary-font'>$" +
      +(product.price * (1 - +product.discount / 100)).toFixed(2) +
      " USD</p>"
    : ""
}
</span>
<p class="text-sm secondary-font">Release date: ${new Date(
    product.release_date
  ).toLocaleDateString()} </p>
<p class="text-sm secondary-font"><a href="https://curso-coder-backend-production.up.railway.app/developers/${
    product.developerId
  }">Developed by: ${product.developer.developer_name}<a/></p>
<span class="flex flex-col gap-y-3">
<p class="text-base primary-font">System requirements:</p>
<p class="text-sm secondary-font">CPU: ${product.CPU}</p>
<p class="text-sm secondary-font">GPU: ${product.GPU}</p>
<p class="text-sm secondary-font">Size: ${product.memory} GB</p>
<p class="text-sm secondary-font">RAM: ${product.RAM} GB</p>
</span>
</div>
`;

  const productDescriptionTemplate = `
<p class="text-xl primary-font">Description</p>
<p class="text-base secondary-font">${product.description}</p>
`;
  const productVideoTemplate = `
<p class="text-xl primary-font">Trailer</p>
<iframe width="1020" height="574" frameborder="0" scrolling="no" src="${product.trailer_video}" title="${product.title}"></iframe>
`;

  productHero.innerHTML = productHeroTemplate;
  productDescription.innerHTML = productDescriptionTemplate;
  productVideo.innerHTML = productVideoTemplate;

  const categoriesProduct = document.getElementById("categoriesProduct");

  const categoriesTemplate = product.categories.map(
    (category, index) => `
    <a class="h-fit" href="https://curso-coder-backend-production.up.railway.app/products?filter=category&filterValue=${
      category.id
    }">
    <p class="text-xs
    secondary-font">
    ${index === product.categories.length - 1
        ? category.category_name
        : category.category_name + "/"
    }
    </p>
    </a>
    `
  );

  categoriesTemplate.forEach((template) => {
    categoriesProduct.innerHTML = categoriesProduct.innerHTML + template;
  });
}

getProduct();

function validateProduct(product) {
  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.release_date ||
    !product.developerId ||
    !product.CPU ||
    !product.RAM ||
    !product.memory ||
    !product.GPU
  ) {
    throw new Error("Form incomplete");
  }
}

updateProductForm.onsubmit = async (e) => {
  try {
    e.preventDefault();
    const product = {
      title: document.getElementById("updateProductTitle").value,
      description: document.getElementById("updateProductDescription").value,
      price: document.getElementById("updateProductPrice").value,
      discount: document.getElementById("updateProductDiscount").value,
      release_date: document.getElementById("updateProductReleaseDate").value,
      trailer_video: document.getElementById("updateProductVideo").value,
      developerId: document.getElementById("updateProductIdDeveloper").value,
      CPU: document.getElementById("updateProductCPU").value,
      RAM: document.getElementById("updateProductRAM").value,
      memory: document.getElementById("updateProductMemory").value,
      GPU: document.getElementById("updateProductGPU").value,
    };

    validateProduct(product);

    await updateProduct(product);
  } catch (error) {
    alert(error);
  }
};
