const sqlite3 = require('sqlite3').verbose();

exports.init = function() {
    let db = new sqlite3.Database('db/storex.db', (err) => {
        if(err) {
            return console.log(err);
        }
        console.log("Successfully connected to DB.");
    });

    const createClientsTable = `
    create table if not exists clients(
        names text,
        phone_number varchar(10), 
        address text,
        PRIMARY KEY(phone_number))
    `

    const createOrdersTable = `
    create table if not exists orders(
        paid int,
        client_id int,
        FOREIGN KEY(client_id) REFERENCES clients(rowid))
    `

    const createProductsTable = `
    create table if not exists products(
        name text,
        quantity int,
        distributor text,
        eta int,
        order_id int,
        FOREIGN KEY(order_id) REFERENCES orders(rowid))
    `;


    db.run(createClientsTable);
    db.run(createOrdersTable);
    db.run(createProductsTable);

    db.close();
    return this;
}

exports.submitOrder = function(order) {
    let db = new sqlite3.Database('db/storex.db');
    console.log('here')
    let getClientRowId = 'SELECT rowid AS id FROM clients WHERE phone_number = ?';
    db.get(getClientRowId, [order.client.phoneNumber], (err, row) => {
        if(err) throw err;
        if(row) {
            console.log("Client found !");
            addOrderAndProducts(db, order, row.id);
        } else {
            addWholeOrder(db, order);
        }
    });
    db.close();
}

function addWholeOrder(db, order) {
    var client = order.client;
    const addClient = `
    insert into clients(names, phone_number, address) 
    values(?, ?, ?)
    `
    db.run(addClient, client.names, client.phoneNumber, client.address, (err) => {
        if(err)  throw err;
        console.log("Client added !");
        addOrderAndProducts(db, order, this.lastID);
    });
}

function addOrderAndProducts(db, order, client_id) {
    const addOrder = `
    insert into orders(client_id, paid)
    values(?, ?)
    `;
    db.run(addOrder, client_id, order.paid, (err) => {
        if(err) throw err;
        console.log("Order added !")
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