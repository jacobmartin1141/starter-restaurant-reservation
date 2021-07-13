const knex = require("../db/connection");

function list() {
    return knex("tables").select("*");
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

function seat(reservation_id, table_id) {
    return knex("tables")
        .where({ table_id })
        .update({ reservation_id: reservation_id, occupied: true })
        .returning("*");
}

function finishTable(table_id) {
    return knex("tables")
        .where({ table_id })
        .update({ reservation_id: null, occupied: false })
        .returning("*");
}

module.exports = {
    list,
    read,
    seat,
    finishTable,
}