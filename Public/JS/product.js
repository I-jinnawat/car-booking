const api = "http://localhost:8080/product";
let productData = [];
let deleteConfirmationModal;
let addproductModal;
let updateproductModal;

const loadData = async () => {
  try {
    const res = await axios.get(api);
    productData = res.data;
    renderTable();
  } catch (error) {
    console.error("Can't load Data because:", error);
  }
};

// Show Table
const renderTable = () => {
  const productTable = document
    .getElementById("product-table")
    .getElementsByTagName("tbody")[0];
  productTable.innerHTML = "";
  productData.forEach((product) => {
    const row = document.createElement("tr");
    row.dataset.productId = product._id;

    const updateButton = createButton("Edit", "btn-primary", editProduct);
    const deleteButton = createButton(
      "Trash",
      "btn-danger",
      confirmDeleteProduct
    );

    const nameCell = createTableCell(product.name);
    const priceCell = createTableCell(product.price);
    const detailCell = createTableCell(product.detail);

    const buttonCell = document.createElement("td");
    buttonCell.appendChild(updateButton);
    buttonCell.appendChild(deleteButton);

    row.appendChild(buttonCell);
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(detailCell);

    productTable.appendChild(row);
  });
};

function createButton(text, className, clickHandler) {
  const button = document.createElement("button");
  button.innerHTML = `<i class="fas fa-${text.toLowerCase()}"></i>`;
  button.type = "button";
  button.classList.add("btn", className, "btn-sm");
  button.addEventListener("click", clickHandler);
  return button;
}

function createTableCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

async function updateProduct(productId, updateData) {
  try {
    const res = await axios.put(`${api}/${productId}`, updateData);
    if (res.status === 200) {
      console.log("Product updated", res.data);
      const index = productData.findIndex(
        (product) => product._id === productId
      );
      if (index !== -1) {
        productData[index] = { ...productData[index], ...updateData };
        renderTable();
      }
    } else {
      console.log("Failed to update product:", res.statusText);
    }
  } catch (error) {
    console.log("Error updating product:", error);
  }
}

function editProduct(event) {
  productId = event.target.closest("tr").dataset.productId;
  const product = productData.find((product) => product._id === productId);
  if (!product) {
    console.error("Error: Product not found");
    return;
  }
  const { name, price, detail } = product;
  populateModal(name, price, detail, updateproductModal);
}

function populateModal(name, price, detail, modal) {
  const productNameInput = document.getElementById("productNameUpdate");
  const productPriceInput = document.getElementById("productPriceUpdate");
  const productDetailTextarea = document.getElementById("productDetailUpdate");
  productNameInput.value = name;
  productPriceInput.value = price;
  productDetailTextarea.value = detail;

  modal.show();
}

async function deleteProduct(productId) {
  try {
    const res = await axios.delete(`${api}/${productId}`);
    if (res.status === 200) {
      console.log("Product deleted");
      productData = productData.filter((product) => product._id !== productId);
      renderTable();
    } else {
      console.log("Failed to delete product:", res.statusText);
    }
  } catch (error) {
    console.log("Error deleting product:", error);
  }
}

function confirmDeleteProduct(event) {
  productId = event.target.closest("tr").dataset.productId;
  deleteConfirmationModal.show();
}

document.getElementById("confirmDelete").addEventListener("click", function () {
  deleteProduct(productId);
  deleteConfirmationModal.hide();
});

async function createProduct(productData) {
  const { name, price, detail } = productData;

  if (!name || !price || !detail) {
    console.log("Please fill in all fields");
    return;
  }

  try {
    const response = await axios.post(api, {
      name: name,
      price: price,
      detail: detail,
    });

    if (response.status === 200 || response.status === 201) {
      console.log("Product created:", response.data);
      appendNewProduct(response.data);
    } else {
      console.log("Failed to create product:", response.status);
    }
  } catch (error) {
    console.log("Error creating product:", error);
  }
}

function appendNewProduct(product) {
  const productTable = document
    .getElementById("product-table")
    .getElementsByTagName("tbody")[0];
  const row = document.createElement("tr");
  row.dataset.productId = product._id;

  const updateButton = createButton("Edit", "btn-primary", editProduct);
  const deleteButton = createButton(
    "Trash",
    "btn-danger",
    confirmDeleteProduct
  );

  const nameCell = createTableCell(product.name);
  const priceCell = createTableCell(product.price);
  const detailCell = createTableCell(product.detail);

  const buttonCell = document.createElement("td");
  buttonCell.appendChild(updateButton);
  buttonCell.appendChild(deleteButton);

  row.appendChild(buttonCell);
  row.appendChild(nameCell);
  row.appendChild(priceCell);
  row.appendChild(detailCell);

  productTable.appendChild(row);
}

document
  .getElementById("addProductButton")
  .addEventListener("click", function () {
    const { name, price, detail } = "";
    populateModal(name, price, detail, addproductModal);
  });

document.getElementById("saveUpdate").addEventListener("click", () => {
  const updatedName = document.getElementById("productNameUpdate").value;
  const updatedPrice = document.getElementById("productPriceUpdate").value;
  const updatedDetail = document.getElementById("productDetailUpdate").value;
  updateProduct(productId, {
    name: updatedName,
    price: updatedPrice,
    detail: updatedDetail,
  });
  updateproductModal.hide();
});

document.getElementById("Saveadd").addEventListener("click", () => {
  const productName = document.getElementById("productNameAdd").value;
  const productPrice = document.getElementById("productPriceAdd").value;
  const productDetail = document.getElementById("productDetailAdd").value;

  const newProduct = {
    name: productName,
    price: productPrice,
    detail: productDetail,
  };
  createProduct(newProduct);
  addproductModal.hide();
});

document.addEventListener("DOMContentLoaded", () => {
  deleteConfirmationModal = new bootstrap.Modal(
    document.getElementById("deleteConfirmationModal")
  );
  addproductModal = new bootstrap.Modal(
    document.getElementById("addproductModal")
  );
  updateproductModal = new bootstrap.Modal(
    document.getElementById("updateproductModal")
  );
  loadData();
});
