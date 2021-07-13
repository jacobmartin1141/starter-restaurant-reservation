const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tableService = require("./tables.service");

async function list(req, res) {
  const data = await tableService.list();
  res.json({ data });
}

async function tableExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await tableService.read(table_id);
  if(table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table with ID ${table_id} not found!`});
}

function read() {
  res.status(200).json({ data: res.locals.table });
}

async function seat(req, res) {
  const data = await tableService.seat(req.body.data.reservation_id, req.params.table_id);
  res.json({ data });
}

async function finishTable(req, res, next) {
  const table_id = req.params.table_id;

  const data = await tableService.finishTable(table_id);

  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(tableExists),
    read,
  ],
  seat: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(seat),
  ],
  finishTable: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(finishTable),
  ]
};
