//returns client rowid by phone number if found
//else adds the client to db
exports.getClientRowId = function(db, order, callback) {
    const getClientRowIdSql = `
    select rowid as client_id 
    from clients 
    where phone_number = ?`;
    db.get(getClientRowIdSql, order.client.phoneNumber, (err, row) => {
        if(err) throw err;
        if(row === undefined) {
            //client not found, add it
            addClient(db, order, callback);
        } else if(callback) {
            console.log(row.client_id);
            callback(db, order, row.client_id);
        }
    });
}

function addClient(db, order, callback) {
    var client = order.client;
    const addClient = `
    insert into clients(names, phone_number, address) 
    values(?, ?, ?)
    `
    db.run(addClient, client.names, client.phoneNumber, client.address, function (err) {
        if(err)  throw err;
        console.log("Client added.");
        if(callback) {
            callback(db, order, this.lastID);
        }
    });
}