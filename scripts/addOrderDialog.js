var productsNumber = 1;

$(document).ready(function() {
    $('#ordersForm').submit(addOrder);
    $('#addOrderDialog').on('hidden.bs.modal',() => {
      $("#addOrderButton").blur();
    });
});

function addProductInput() {
    productsNumber++;

    const productInputField = `
    <div class="row" id="product${productsNumber-1}">
      <div class="col-md-3 nopadding">
        <input type="text" class="form-control small-padding" id="productName${productsNumber-1}" placeholder="Продукт ${productsNumber}">
      </div>
      <div class="col-md-2 nopadding">
        <input type="text" class="form-control small-padding" id="productQuantity${productsNumber-1}" placeholder="Кол-во">
      </div>
      <div class="col-xs-1 nopadding">
        <select id="quntityType${productsNumber-1}" class="form-control nopadding" data-live-search="true">
            <option value="number" selected>бр</option>
            <option value="sqrMeters">м&sup2;</option>
        </select>
      </div>
      <div  class="col-md-2 nopadding">
      <input type="text" class="form-control small-padding" id="productPrice${productsNumber-1}" placeholder="Цена">
      </div>
      <div class="col-xs-3 nopadding">
        <input type="text" class="form-control small-padding" id="productDistributor${productsNumber-1}" placeholder="Доставчик">
      </div>
      <div class="col-md-1 nopadding">
        <input type="text" class="form-control small-padding" id="productETA${productsNumber-1}" placeholder="Дни">
      </div>
    </div>
    `;

    $("#productsContainer").append(productInputField);
}

function removeProductInput() {
  if(productsNumber > 1) {
    productsNumber--;
    $("#product" + productsNumber).remove();
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
  var hasError = false;
  if(!order.client.names || !order.client.names.match(lettersAndSpacesRegEx)) {
    handleError("#clientNames");
    hasError = true;
  }

  if(!order.client.phoneNumber || isNaN(order.client.phoneNumber) || order.client.phoneNumber.length !== 10) {
    handleError("#clientNumber");
    hasError = true;
  }

  for(var i = 0; i < productsNumber; i++) {
    var currentProduct = order.products[i];
    
    if(!currentProduct.name) {
      handleError("#productName" + i);
      hasError = true;
    }
    if(!currentProduct.quantity) {
      handleError("#productQuantity" + i);
      hasError = true;
    }
  }

  return !hasError;
}

function addOrder(event) {
  event.preventDefault();
  $(".has-error").removeClass("has-error");
  $(".help-block").addClass("hidden");
  var order = getFormInput();
  if(validateOrder(order)) {
    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send('submitOrderToDb', order);
    $("#closeButton").click();
    return true;
  }
  return false;
}