const socketClientAdmin = io();
const listProducts = document.getElementById("listProducts");
const back = document.getElementById("back");
const createProductForm = document.getElementById("createProductForm");
const deleteProductForm = document.getElementById("deleteProductForm");

async function createProduct(newData) {
  try {
    validateProduct(newData);

    if (Cookies.get("token")) {
      await axios.post("https://curso-coder-backend-production.up.railway.app/api/products/", newData, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.post("https://curso-coder-backend-production.up.railway.app/api/products/", newData);
    }

    socketClientAdmin.emit("getAllProducts");

    const section = document.getElementById("createProductFormMessageSection");

    section.innerText = "Product created successfully";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function deleteProduct(id) {
  try {
    if (!id) {
      throw new Error("Form incomplete");
    }

    if (Cookies.get("token")) {
      await axios.delete(`https://curso-coder-backend-production.up.railway.app/api/products/${id}`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.delete(`https://curso-coder-backend-production.up.railway.app/api/products/${id}`);
    }

    socketClientAdmin.emit("getAllProducts");

    const section = document.getElementById("deleteProductFormMessageSection");

    section.innerText = "Product deleted successfully";
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

socketClientAdmin.emit("getAllProducts");

function compileProducts(products) {
  const productsTemplate = products.map(
    (product) => `
      <a href="https://curso-coder-backend-production.up.railway.app/products/${product.id}" class="w-full">
      <div class="p-2 flex items-center gap-x-3 border border-solid border-indigo-500 bg-indigo-50">
      <p class="text-sm secondary-font">ID: ${product.id}</p>
      <p class="text-sm secondary-font">Title: ${product.title}</p>
      <p class="text-sm secondary-font">Price: ${product.price} USD</p>
      <p class="text-sm secondary-font">Discount: ${product.discount}%</p>
      </div>
      </a>
      `
  );

  listProducts.innerHTML = "";

  productsTemplate.forEach((template) => {
    listProducts.innerHTML = listProducts.innerHTML + template;
  });
}

socketClientAdmin.on("updatedProducts", (products) => {
  compileProducts(products);
});

createProductForm.onsubmit = async (e) => {
  e.preventDefault();
  const product = {
    title: document.getElementById("createProductTitle").value,
    description: document.getElementById("createProductDescription").value,
    price: document.getElementById("createProductPrice").value,
    discount: document.getElementById("createProductDiscount").value,
    release_date: document.getElementById("createProductReleaseDate").value,
    trailer_video: document.getElementById("createProductVideo").value,
    developerId: document.getElementById("createProductIdDeveloper").value,
    CPU: document.getElementById("createProductCPU").value,
    RAM: document.getElementById("createProductRAM").value,
    memory: document.getElementById("createProductMemory").value,
    GPU: document.getElementById("createProductGPU").value,
  };

  await createProduct(product);
};

deleteProductForm.onsubmit = async (e) => {
  e.preventDefault();

  await deleteProduct(+document.getElementById("deleteProductId").value);
};

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
