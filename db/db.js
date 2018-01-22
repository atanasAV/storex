const sqlite3 = require('sqlite3').verbose();
const ordersDb = require('./orders');
const clientsDb = require('./clientsDb');

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

exports.submitNewOrder = function(order) {
    let db = new sqlite3.Database('db/storex.db');

    //Get client rowid and add order
    var callback = ordersDb.addOrder;
    clientsDb.getClientRowId(db, order.client.phoneNumber, callback);

    db.close();
}