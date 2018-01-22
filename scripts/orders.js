$( document ).ready(function() {

  console.log("YES !");
    $("#addOrderButton").click(initAddOrder);
    
    for(i = 1; i <= 4; i++) {
        orderNumber = i;
        itemsCount = i+1 + "/" + (i+2);

        const order = `
        <h4 class="panel-title">
          <a class="list-group-item list-group-item-action"
             ${(i%2==0) ? 'style="background-color:#f5f5f5"' : ''}
             data-toggle="collapse" 
             href="#orderDetails${orderNumber}">
             Поръчка : ${orderNumber} 
             <span class="badge" style="background-color:#5BC85B">Платено</span>
             <span class="badge" style="background-color:red">${itemsCount}</span>
          </a>
        </h4>
       `;

       const orderDetails = `
       <div class="panel-collapse collapse" id="orderDetails${orderNumber}">
         <div class="panel-footer">
           Some details here.
         </div>
       </div>
       `;

       const orderList = order + orderDetails;

       $("#ordersList").append(orderList);
    }
    $(".list-group-item").addClass('no-hover');
    $(".list-group-item-action").addClass('no-hover');
})

function initAddOrder() {
  $("#addOrderDialog").empty();
  $("#addOrderDialog").load("html/addOrderDialog.html");
  $.getScript("scripts/addOrderDialog.js");
}