const { Router } = require("express");
const bookingController = require("../controllers/BookingController");
const router = Router();

const validateManager = require("../middlewares/validateManager");

router.get("/list", validateManager ,bookingController.getEvents);
router.post("/add-event", validateManager, bookingController.addEvent);
router.put("/update/:id", validateManager, bookingController.updateEvent);
router.post("/orders/add-menu", validateManager, bookingController.addMenuOrders);
router.get("/orders/:event_id", validateManager, bookingController.getOrdersInEvent);
router.delete("/delete/:event_id", validateManager, bookingController.deleteBooking);

module.exports = router;