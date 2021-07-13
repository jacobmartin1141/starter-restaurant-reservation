const knex = require("../db/connection");

function list(reservation_date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date });

}

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .first();
}

function create(reservation_data) {
    return knex("reservations")
        .insert(reservation_data)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function update(reservation_id, newData) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ ...newData })
        .returning("*");
}

module.exports = {
    list,
    search,
    read,
    create,
    update,
};