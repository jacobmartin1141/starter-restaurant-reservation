
exports.up = function(knex) {
    return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.integer("capacity").notNullable();
      table.string("table_name").notNullable();
      table.boolean("occupied").notNullable();
      table.integer("reservation_id").unsigned().index().references("reservation_id").inTable("reservations");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable("tables");
  };