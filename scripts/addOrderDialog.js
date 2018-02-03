var productsNumber = 1;

$(document).ready(function() {
    $("#addProductInputFieldButton").click(addProductInput);
    $('#ordersForm').submit(addOrder);
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

    var row = document.createElement('div');
    row.innerHTML = productInputField;

    while(row.firstChild) {
      $("#productsDiv").append(row.firstChild);
  }
}

function getFormInput() {
  var order = {};
  order.client = {};
  order.client.names = $("#clientNames").val();
  order.client.phoneNumber = $("#clientNumber").val();
  order.client.address = $("#clientAddress").val();

  order.products = {};
  for(var i = 0; i < productsNumber; i++) {
    currentProduct = {};
    currentProduct.name = $("#productName" + i).val();
    currentProduct.quantity = $("#productQuantity" + i).val();
    currentProduct.distributor = $("#productDistributor" + i).val();
    currentProduct.ETA = $("#productETA" + i).val();
    order.products[i] = currentProduct;
  }
  order.paid = $("#orderPaid").is(":checked");

  return order;
}

function handleError(id) {
  $(id).parent().addClass("has-error");
  $(id + "Error").removeClass("hidden");
}

function validateOrder(order) {
  var lettersAndSpacesRegEx = /^[a-zA-Z\s]*$/;
  if(!order.client.names || !order.client.names.match(lettersAndSpacesRegEx)) {
    handleError("#clientNames");
    return false;
  }

  console.log(order.client.phoneNumber.length);
  if(!order.client.phoneNumber || isNaN(order.client.phoneNumber) || order.client.phoneNumber.length !== 10) {
    handleError("#clientNumber");
    return false;
  }


  return true;
}

function addOrder(event) {
  event.preventDefault();
  var order = getFormInput();
  if(validateOrder(order)) {
    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send('submitOrderToDb', order);
    $("#closeButton").click();
    return true;
  }
  return false;
}