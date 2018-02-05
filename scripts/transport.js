$( document ).ready(() => {
    for(var i = 0; i < 10; i++) {
        const order = `
        <div class="panel panel-${i%2 ? 'danger' : 'success'}" id="order${i}"></div>
        `;
        $("#transport").append(order);
        var addDetailsCallback = addDetails.bind({orderNumber: i});
        $("#order" + i).load("html/transportOrder.html", addDetailsCallback);
        
    }
})

function addDetails() {
    const items = `
    <li>Продукт 1 26м&sup2;</li>
    <li>Продукт 2 120м&sup2;</li>
    <li>Продукт 3 45m&sup2;</li>
    <li>Продукт 4 1бр;</li>
    <li>Продукт 5 2бр;</li>
    `;

    $("#order" + this.orderNumber).find(".clientName").append("ул. Раковски 15 А ет.4");
    $("#order" + this.orderNumber).find(".clientAddress").append("Иван Иванов");
    $("#order" + this.orderNumber).find(".clientNumber").append("0882159203");
    if(this.orderNumber%2) {
        $("#order" + this.orderNumber).find(".price").append("382 лв.");
    }
    $("#order" + this.orderNumber).find(".items").append(items);
    
}