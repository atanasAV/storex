exports.addOrder = function(db, order, client_id) {
    const addOrder = `
    insert into orders(client_id, paid)
    values(?, ?)
    `;
    db.run(addOrder, client_id, order.paid, (err) => {
        if(err) throw err;
        console.log("Order added.")
        addProducts(db, order.products, this.lastID);
    });
}

function addProducts(db, products, order_id) {
    const addProduct = `
    insert into products(name, quantity, distributor, eta, order_id)
    values(?, ?, ?, ?, ?)
    `;
    var preparedStatement = db.prepare(addProduct, (err) => {
        if(err) throw err;
    })
    for(var i = 0; i < products.length; i++) {
        preparedStatement.run(
            products.name, 
            products.quantity, 
            products.distributor, 
            products.eta, order_id);
    }
    preparedStatement.finalize();
}