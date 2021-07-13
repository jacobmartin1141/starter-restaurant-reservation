const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reServ = require("./reservations.service");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time"
]

const hasProperties = require("../errors/hasProperties")(...VALID_PROPERTIES);

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  let data
  if (req.query.mobile_phone) {
    data = await reServ.search(req.query.mobile_phone);
  } else if(req.query.date) {
    data = await reServ.list(req.query.date);
  }
  res.json({ data });
}

async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const reservation = await reServ.read(reservation_id);
  if(reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation with ID ${reservation_id} not found!`});
}

function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

async function create(req, res) {
  const data = await reServ.create({...req.body.data, status: "booked"});
  res.status(201).json({ data });
}

function validMobile(req, res, next) {
  const data = req.body.data.mobile_number;
  
  if (![10, 11, 7].includes(data)) {
    return next({ status: 400, messsage: "Your phone number is the wrong length!" })
  }

  if (!/^\d+$/.test(value)) {
    return next({ status: 400, message: "Your phone number must only include numbers and dashes!" })
  }

  next();
}

function validPeople(req, res, next) {
  const data = req.body.data.people;

  if(data < 1) {
    return next({ status: 400, message: "People property must be at least one!" });
  }

  next();
}

function dateValid(req, res, next) {
  const data = req.body.data.reservation_date;
  
  if (data.length !== 10) {
    return next({ status: 400, messsage: "Reservation date incomplete!" })
  }

  if (data.replace(/-/g,'') < new Date().toJSON().slice(0,10).replace(/-/g,'')) {
    return next({ status: 400, message: "Set reservation date to be in the future!" });
  }

  next();
}

function timeValid(req, res, next) {
  const data = req.body.data.reservation_time;

  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const currTime = (!hour.length < 2 ? "0" + hour : hour) + (minute.length < 2 ? "0" + minute : minute);

  const valForm = data.replace(/[: ]/g,"");

  if (valForm < currTime ) {
    return next({ status: 400, message: "Set reservation time to be in the future!" });
  }
  if (valForm > 2130) {
    return next({ status: 400, message: "Reservation time needs be before 9:30 PM!" });
  }
  if (valForm < 1030) {
    return next({status: 400, messsage: "Reservation time needs be after 10:30 AM!" });
  }

  next();
}

async function update(req, res) {
  const data = await reServ.update(req.params.reservation_id, {...res.locals.reservation, ...req.body.data});
  res.status(200).json({ data: data });
}

module.exports = {
  list: [
    asyncErrorBoundary(list),
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    read,
  ],
  create: [
    hasProperties,
    validMobile,
    validPeople,
    dateValid,
    timeValid,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ]
};
