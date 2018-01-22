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
        client_number varchar(10), 
        client_names text)
    `

    const ordersTableSql = `
    create table if not exists orders(
        client_id int,
        order_paid int,
        FOREIGN KEY(client_id) REFERENCES clients(client_id))
    `


    db.run(clientsTableSql);
    db.run(ordersTableSql)

    db.close();
    return this;
}

exports.addOrder = function(order) {

}