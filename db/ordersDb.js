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

exports.addOrder = function(order) {
    let db = new sqlite3.Database('db/storex.db');
    console.log('here')
    db.each('select rowid rowId from clients where phone_number = ?', [order.client.phoneNumber], (err, row) => {
        console.log("callback")
        if(err) console.log(err);

        if(row.rowId) {
            console.log(row.rowId);
        } else {
            addClient(db, order.client);
        }
    });
    db.close();
}

function addClient(db, client) {
    console.log('adding client');
    const addClient = `
    insert into clients(names, phone_number, address) 
    values(?, ?, ?)
    `
    db.run(addClient, client.names, client.phoneNumber, client.address);
}
