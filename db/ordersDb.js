const sqlite3 = require('sqlite3').verbose();

exports.init = function() {
    let db = new sqlite3.Database('db/storex.db', (err) => {
        if(err) {
            return console.log(err);
        }
        console.log("Successfully connected to DB.");
    });

    const clientsTableSql = `
    create table if not exists clients(
        names text,
        phone_number varchar(10), 
        address text)
    `

    const ordersTableSql = `
    create table if not exists orders(
        client_id int,
        paid int,
        FOREIGN KEY(client_id) REFERENCES clients(rowid))
    `


    db.run(clientsTableSql);
    db.run(ordersTableSql)

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
        addProducts(order.products, this.lastID);
    });
}

function addProducts(products, order_id) {
    console.log("No products yet :)) !")
}