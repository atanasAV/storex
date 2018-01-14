const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('storex.db');


exports.addOrder = function(order) {
    console.log(order);
}