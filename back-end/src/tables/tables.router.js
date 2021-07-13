/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./tables.controller");

const notFound = require("../errors/notFound");

router.route("/")
    .get(controller.list)
//      .post(controller.create)
    .all(notFound);

router.route("/:table_id/seat")
    .put(controller.seat)
    .delete(controller.finishTable)
    .all(notFound);

router.route("/:table_id")
    .get(controller.read)
    //  .put(controller.update)
    .all(notFound);

 module.exports = router;