var productsNumber = 1;
const ipcRenderer = require('electron').ipcRenderer;

$(document).ready(function() {
    document.getElementById("addProductInputField").addEventListener("click", addProductInput);
});

function addProductInput() {
    productsNumber++;

    const productInputField = `
    <div class="row">
      <div class="col-md-4">
        <input type="text" class="form-control" id="product${productsNumber}" placeholder="Продукт ${productsNumber}">
      </div>
      <div class="col-md-2">
        <input type="text" class="form-control" id="productQuantity${productsNumber}" placeholder="Кол-во">
      </div>
      <div class="col-md-4">
        <input type="text" class="form-control" id="productDistributor${productsNumber}" placeholder="Доставчик">
      </div>
      <div class="col-md-2">
        <input type="text" class="form-control" id="productETA${productsNumber}" placeholder="Дни">
      </div>
    </div>
    `;

    document.getElementById("productsDiv").innerHTML += productInputField;
}

function submitForm(event) {
  event.preventDefault() // stop the form from submitting
  var order = {};
  order.clientNames = document.getElementById("clientNames").value;
  order.clientNumber = document.getElementById("clientNumber").value;
  order.clientAddress = document.getElementById("clientAddress").value;
  ipcRenderer.send('form-submission', order);
}