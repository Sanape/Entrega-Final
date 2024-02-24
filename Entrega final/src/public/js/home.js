const added = document.getElementById("added");
const discounts = document.getElementById("discounts");
const populars = document.getElementById("populars");
const hero = document.getElementById("hero");

hero.style.backgroundImage = "url('../assets/pexels-pixabay-159393.jpg')";

let productsAdded = [];
let productsDiscounts = [];
let productsPopulars = [];

async function getProducts(url, template) {
  try {
    const response = await axios.get(url);

    compileProducts(response.data.message.rows, template);
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

function compileProducts(products, template) {
  const productsTemplate = products.map(
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

  productsTemplate.forEach((productTemplate) => {
    template.innerHTML = template.innerHTML + productTemplate;
  });
}

//Solo para propositos esteticos
getProducts(
  'https://curso-coder-backend-production.up.railway.app/api/products?sort=createdAt&order=DESC&limit=5&filter=recent&filterValue={"endDate":"December 9, 2023", "startDate":"December 2, 2023"}',
  added
);

getProducts(
  "https://curso-coder-backend-production.up.railway.app/api/products?sort=discount&order=DESC&limit=5",
  discounts
);

//Solo para propositos esteticos
getProducts(
  'https://curso-coder-backend-production.up.railway.app/api/products?sort=popularity&order=DESC&limit=5&filter=popularity&filterValue={"endDate":"February 29, 2024", "startDate":"December 1, 2023"}',
  populars
);
