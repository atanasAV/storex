var productsNumber = 1;

$(document).ready(function() {
  $("#product0").load("html/productInputField.html", addPlaceholder);
  $('#ordersForm').submit(addOrder);
  $('#addOrderDialog').on('hidden.bs.modal',() => {
    $("#addOrderButton").blur();
  });
});

function addProductInput() {
    productsNumber++;

    const productInputRow = `<div class="row" id="product${productsNumber-1}"></div>`;
    $("#productsContainer").append(productInputRow);
    $("#product" + (productsNumber-1)).load("html/productInputField.html", addPlaceholder);
}

function addPlaceholder() {
  $(this).find(".productName").attr("placeholder", "Продукт " + productsNumber);
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
    var currentProduct = {};
    const productId = `#product${i}`;
    currentProduct.name = $(productId).find(".productName").val();
    currentProduct.quantity = $(productId).find(".productQuantity").val();
    currentProduct.quantityType = $(productId).find(".quantityType").val();
    currentProduct.price = $(productId).find(".productPrice").val();
    currentProduct.distributor = $(productId).find(".productDistributor").val();
    currentProduct.ETA = $(productId).find(".productETA").val();
    order.products[i] = currentProduct;
    console.log(currentProduct);
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