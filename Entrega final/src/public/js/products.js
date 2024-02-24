const urlString = window.location.search;
const urlParams = new URLSearchParams(urlString);
let page = urlParams.get("page") || 1;
let orderBy = urlParams.get("order");
let sortBy = urlParams.get("sort");
let filter = urlParams.get("filter");
let filterValue = urlParams.get("filterValue");
let hrefProducts = `https://curso-coder-backend-production.up.railway.app/products?page=${page}`;
const order = document.getElementById("order");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const minDiscount = document.getElementById("minDiscount");
const maxDiscount = document.getElementById("maxDiscount");
const categorySelect = document.getElementById("categorySelect");
const foundProducts = document.getElementById("foundProducts");
let filterWithMajorAndMinor = {};
const pagination = document.getElementById("pagination");
const resetFilters = document.getElementById("resetFilters");

function updateHrefProducts() {
  hrefProducts = `https://curso-coder-backend-production.up.railway.app/products?page=${page}`;

  if (orderBy && sortBy) {
    hrefProducts = hrefProducts + `&sort=${sortBy}&order=${orderBy}`;
  }

  if (filter && filterValue) {
    hrefProducts =
      hrefProducts + `&filter=${filter}&filterValue=${filterValue}`;
  }
}

updateHrefProducts();

async function getProducts() {
  let orderParams = JSON.stringify({
    sort: sortBy,
    order: orderBy,
  });

  let filterParams = JSON.stringify({
    filter: filter,
    filterValue: filterValue,
  });

  if (!urlParams.get("sort") || !urlParams.get("order")) {
    orderParams = "";
  }

  order.value = orderParams;

  try {
    let url = `https://curso-coder-backend-production.up.railway.app/api/products?`;

    if (!urlParams.get("limit")) {
      url = url + "limit=12&";
    }

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
    compileProducts(response.data.message.rows);
    compilePagination(
      response.data.message.prevLink,
      response.data.message.nextLink,
      response.data.message.count
    );
    if (filter === "category") {
      categorySelect.value = filterParams;
    } else if (filter === "price") {
      let values = JSON.parse(filterValue);
      maxPrice.value = values.majorPrice;
      minPrice.value = values.minorPrice;
    } else if (filter === "discount") {
      let values = JSON.parse(filterValue);
      maxDiscount.value = values.majorDiscount;
      minDiscount.value = values.minorDiscount;
    }
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function getCategories() {
  try {
    const response = await axios.get("https://curso-coder-backend-production.up.railway.app/api/categories");

    categorySelect.innerHTML = `
      <option value="">None</option>
      `;

    response.data.message.forEach((category) => {
      categorySelect.innerHTML =
        categorySelect.innerHTML +
        `
      <option value='{"filter":"category","filterValue":"${category.id}"}'>${category.category_name}</option>
      `;
    });
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function compileProducts(products) {
  if (products.length > 0) {
    const productsTemplate = products.map(
      (product) => `
        <a href="https://curso-coder-backend-production.up.railway.app/products/${
          product.id
        }" class="w-fit h-fit"
        >
        <div class="flex flex-col justify-center items-center relative" >
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
            ? (+product.price * (1 - +product.discount / 100)).toFixed(2) +
              " USD"
            : ""
        }</p>
        </span>
        </div>
        <div/>
        </a>
        `
    );

    productsTemplate.forEach((template) => {
      foundProducts.innerHTML = foundProducts.innerHTML + template;
    });
  } else {
    foundProducts.innerHTML = `<p class="w-full text-center text-3xl secondary-font pt-10">No results</p>`;
  }
}

getCategories();
getProducts();

order.onchange = (e) => {
  e.preventDefault();

  const orderAsked = JSON.parse(order.value);

  orderBy = orderAsked.order;
  sortBy = orderAsked.sort;
  updateHrefProducts();

  location.href = hrefProducts;
};

categorySelect.onchange = (e) => {
  e.preventDefault();

  const categoryAsked = JSON.parse(categorySelect.value);

  filter = categoryAsked.filter;
  filterValue = categoryAsked.filterValue;
  updateHrefProducts();

  location.href = hrefProducts;
};

minPrice.onchange = (e) => {
  e.preventDefault();

  if (
    filterWithMajorAndMinor.filter &&
    filterWithMajorAndMinor.filter === "price"
  ) {
    filterWithMajorAndMinor.filterValue.minorPrice = minPrice.value;
  } else if (!filterWithMajorAndMinor.filter) {
    filterWithMajorAndMinor.filter = "price";
    filterWithMajorAndMinor.filterValue = {
      minorPrice: minPrice.value,
    };
  } else if (!minPrice.value) {
    filterWithMajorAndMinor = {};
  }
  if (
    filterWithMajorAndMinor.filter &&
    filterWithMajorAndMinor.filterValue.majorPrice &&
    filterWithMajorAndMinor.filterValue.minorPrice
  ) {
    filterWithMajorAndMinor.filterValue = JSON.stringify(
      filterWithMajorAndMinor.filterValue
    );
    filter = filterWithMajorAndMinor.filter;
    filterValue = filterWithMajorAndMinor.filterValue;
    updateHrefProducts();
    location.href = hrefProducts;
  }
};

maxPrice.onchange = (e) => {
  e.preventDefault();

  if (
    filterWithMajorAndMinor.filter &&
    filterWithMajorAndMinor.filter === "price"
  ) {
    filterWithMajorAndMinor.filterValue.majorPrice = maxPrice.value;
  } else if (!filterWithMajorAndMinor.filter) {
    filterWithMajorAndMinor.filter = "price";
    filterWithMajorAndMinor.filterValue = {
      majorPrice: maxPrice.value,
    };
  } else if (!maxPrice.value) {
    filterWithMajorAndMinor = {};
  }
  if (
    filterWithMajorAndMinor.filter &&
    filterWithMajorAndMinor.filterValue.majorPrice &&
    filterWithMajorAndMinor.filterValue.minorPrice
  ) {
    filterWithMajorAndMinor.filterValue = JSON.stringify(
      filterWithMajorAndMinor.filterValue
    );
    filter = filterWithMajorAndMinor.filter;
    filterValue = filterWithMajorAndMinor.filterValue;
    updateHrefProducts();
    location.href = hrefProducts;
  }
};

minDiscount.onchange = (e) => {
  e.preventDefault();

  if (
    filterWithMajorAndMinor.filter &&
    filterWithMajorAndMinor.filter === "discount"
  ) {
    filterWithMajorAndMinor.filterValue.minorDiscount = minDiscount.value;
  } else if (!filterWithMajorAndMinor.filter) {
    filterWithMajorAndMinor.filter = "discount";
    filterWithMajorAndMinor.filterValue = {
      minorDiscount: minDiscount.value,
    };
  } else if (!minDiscount.value) {
    filterWithMajorAndMinor = {};
  }
  if (
    filterWithMajorAndMinor.filter &&
    filterWithMajorAndMinor.filterValue.majorDiscount &&
    filterWithMajorAndMinor.filterValue.minorDiscount
  ) {
    filterWithMajorAndMinor.filterValue = JSON.stringify(
      filterWithMajorAndMinor.filterValue
    );
    filter = filterWithMajorAndMinor.filter;
    filterValue = filterWithMajorAndMinor.filterValue;
    updateHrefProducts();
    location.href = hrefProducts;
  }
};

maxDiscount.onchange = (e) => {
  e.preventDefault();

  if (
    filterWithMajorAndMinor.filter &&
    filterWithMajorAndMinor.filter === "discount"
  ) {
    filterWithMajorAndMinor.filterValue.majorDiscount = maxDiscount.value;
  } else if (!filterWithMajorAndMinor.filter) {
    filterWithMajorAndMinor.filter = "discount";
    filterWithMajorAndMinor.filterValue = {
      majorDiscount: maxDiscount.value,
    };
  } else if (!maxDiscount.value) {
    filterWithMajorAndMinor = {};
  }

  if (
    filterWithMajorAndMinor.filter &&
    filterWithMajorAndMinor.filterValue.majorDiscount &&
    filterWithMajorAndMinor.filterValue.minorDiscount
  ) {
    filterWithMajorAndMinor.filterValue = JSON.stringify(
      filterWithMajorAndMinor.filterValue
    );
    filter = filterWithMajorAndMinor.filter;
    filterValue = filterWithMajorAndMinor.filterValue;
    updateHrefProducts();
    location.href = hrefProducts;
  }
};

function compilePagination(prevLink, nextLink, totalPages) {
  if (prevLink) {
    pagination.innerHTML =
      pagination.innerHTML +
      `<a href='${prevLink.replace("/api", "")}' class="text-xl">
    <i class="fa-solid fa-angle-left text-orange-600 "></i>
    </a>`;
  } else {
    pagination.innerHTML =
      pagination.innerHTML +
      `<a href="javascript:void(0)" class="text-xl cursor-default">
    <i class="fa-solid fa-angle-left text-gray-600 "></i>
    </a>`;
  }
  pagination.innerHTML =
    pagination.innerHTML +
    `<p class="secondary-font text-sm"><span class="text-xl">${page} </span> of <span class="text-xl">${Math.ceil(
      +totalPages / 12
    )}</span></p>`;
  if (nextLink) {
    pagination.innerHTML =
      pagination.innerHTML +
      `<a href='${nextLink.replace("/api", "")}' class="text-xl">
    <i class="fa-solid fa-angle-right text-orange-600 "></i>
    </a>`;
  } else {
    pagination.innerHTML =
      pagination.innerHTML +
      `<a href="javascript:void(0)" class="text-xl cursor-default">
    <i class="fa-solid fa-angle-right text-gray-600 "></i>
    </a>`;
  }
}

resetFilters.onclick = (e) => {
  e.preventDefault();

  location.href = "https://curso-coder-backend-production.up.railway.app/products?page=1";
};
