const socketClientAdmin = io();
const listCategories = document.getElementById("listCategories");
const back = document.getElementById("back");
const createCategoryForm = document.getElementById("createCategoryForm");
const updateCategoryForm = document.getElementById("updateCategoryForm");
const deleteCategoryForm = document.getElementById("deleteCategoryForm");

async function createCategory(newData) {
  try {
    if (!newData.category_name) {
      throw new Error("Form incomplete");
    }

    if (Cookies.get("token")) {
      await axios.post("https://curso-coder-backend-production.up.railway.app/api/categories/", newData, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.post("https://curso-coder-backend-production.up.railway.app/api/categories/", newData);
    }

    socketClientAdmin.emit("getAllCategories");

    const section = document.getElementById("createCategoryFormMessageSection");

    section.innerText = "Category created successfully";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function deleteCategory(id) {
  try {
    if (!id) {
      throw new Error("Form incomplete");
    }

    if (Cookies.get("token")) {
      await axios.delete(`https://curso-coder-backend-production.up.railway.app/api/categories/${id}`, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.delete(`https://curso-coder-backend-production.up.railway.app/api/categories/${id}`);
    }

    socketClientAdmin.emit("getAllCategories");

    const section = document.getElementById("deleteCategoryFormMessageSection");

    section.innerText = "Category deleted successfully";
  } catch (err) {
    if (err.response) {
      alert(`${err.response.data.Error}`);
    } else {
      alert(err);
    }
  }
}

async function updateCategory(id, newData) {
  try {
    if (!id || !newData.category_name) {
      throw new Error("Form incomplete");
    }

    if (Cookies.get("token")) {
      await axios.put(`https://curso-coder-backend-production.up.railway.app/api/categories/${id}`, newData, {
        headers: {
          Authorization: Cookies.get("token"),
        },
      });
    } else {
      await axios.put(`https://curso-coder-backend-production.up.railway.app/api/categories/${id}`, newData);
    }

    socketClientAdmin.emit("getAllCategories");

    const section = document.getElementById("updateCategoryFormMessageSection");

    section.innerText = "Category updated successfully";
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

socketClientAdmin.emit("getAllCategories");

function compileCategories(categories) {
  const categoriesTemplate = categories.map(
    (category) => `
      <a href="https://curso-coder-backend-production.up.railway.app/products?filter=category&filterValue=${category.id}" class="h-fit">
      <div class="p-2 flex items-center gap-x-3 border border-solid border-indigo-500 bg-indigo-50">
      <p class="text-sm secondary-font">ID: ${category.id}</p>
      <p class="text-sm secondary-font">${category.category_name}</p>
      </div>
      </a>
      `
  );

  listCategories.innerHTML = "";

  categoriesTemplate.forEach((template) => {
    listCategories.innerHTML = listCategories.innerHTML + template;
  });
}

socketClientAdmin.on("updatedCategories", (categories) => {
  compileCategories(categories);
});

createCategoryForm.onsubmit = async (e) => {
  e.preventDefault();
  const category = {
    category_name: document.getElementById("createCategoryName").value,
  };

  await createCategory(category);
};

updateCategoryForm.onsubmit = async (e) => {
  e.preventDefault();

  await updateCategory(+document.getElementById("updateCategoryId").value, {
    category_name: document.getElementById("updateCategoryName").value,
  });
};

deleteCategoryForm.onsubmit = async (e) => {
  e.preventDefault();

  await deleteCategory(+document.getElementById("deleteCategoryId").value);
};
