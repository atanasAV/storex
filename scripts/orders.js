$( document ).ready(() => {
    $("#addOrderButton").click(initAddOrder);

    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send("getOrders");

    ipcRenderer.on("getOrdersResult", renderOrders);
    $(".list-group-item").addClass('no-hover');
    $(".list-group-item-action").addClass('no-hover');
    $('[id^="orderDetails"]').on("hidden.bs.collapse", () => {
      console.log("asd")
      $('[id^="orderMeta"]').blur();
    });
})

function renderOrders(event, args) {
  var numberOfOrders = args.length;
  for(var i = 0; i < numberOfOrders; i++) {
    var order = args[i];
    orderNumber = i;
    itemsCount = i+1 + "/" + (i+2);
    
    const orderHtml = `
    <h4 id="orderMeta${orderNumber}" class="panel-title">
      <a class="list-group-item list-group-item-action"
         ${(i%2 == 0) ? 'style="background-color:#f5f5f5"' : ''}
         data-toggle="collapse" 
         href="#orderDetails${orderNumber}">
         ${order.names}
         ${(order.paid) ? '<span class="badge" style="background-color:#5BC85B">Платено</span>' : ''}
         <span class="badge" style="background-color:red">${itemsCount}</span>
      </a>
    </h4>
   `;

   const orderDetailsHtml = `
   <div class="panel-collapse collapse" id="orderDetails${orderNumber}">
    <div class="panel-footer">
      <div class="row">
        <div class="col-md-6">Total cost</div>
        <div class="col-md-6 text-right">$42</div>
      </div>
    </div>
   </div>
   `;

   const orderList = orderHtml + orderDetailsHtml;

   $("#ordersList").append(orderList);
  }
}

function initAddOrder() {
  this.blur();
  $("#addOrderDialog").empty();
  $("#addOrderDialog").load("html/addOrderDialog.html");
  $.getScript("scripts/addOrderDialog.js");
}