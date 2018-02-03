const sqlite3 = require('sqlite3').verbose();
const ordersDb = require('./ordersDb');
const clientsDb = require('./clientsDb');

exports.init = function() {
    let db = new sqlite3.Database('db/storex.db', (err) => {
        if(err) {
            return console.log(err);
        }
        console.log("Successfully connected to DB.");
    });

    // SCHEMA
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
        date_created timestamp default current_timestamp,
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

    const createProductsIndex = `
    create index order_id_index
    on products (order_id)
    `;

    db.run(createClientsTable);
    db.run(createOrdersTable);
    db.run(createProductsTable);

    db.close();
    return this;
}

exports.submitNewOrder = function(order) {
    let db = new sqlite3.Database('db/storex.db');

    var callback = ordersDb.addOrder;
    clientsDb.getClientRowId(db, order, callback);

    console.log("before close")
    db.close();
    console.log("after close")
}

exports.getOrdersList = function(callback) {
    let db = new sqlite3.Database('db/storex.db');
    //const sql = `select * from orders`;
    const sql = `
    select orders.rowid as rowID, orders.paid, clients.names
    from orders
    inner join clients on orders.client_id=clients.rowid
    order by orders.date_created DESC
    `;

    db.all(sql, (err, rows) => {
        if(err) console.log(err);

        if(callback) {
            console.log(rows);
            callback(rows);
        }
        
    });
    db.close();
}