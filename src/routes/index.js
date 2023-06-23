const {Router} = require("express");

const employeeRouter = require("./employees");
const userRouter = require("./users");
const discountRouter = require("./discounts");
const bookingRouter = require("./bookings");
const typeRouter = require("./types");
const menuRouter = require("./menus");

const router = Router();

router.use("/employees", employeeRouter);
router.use("/users", userRouter);
router.use("/discounts", discountRouter);
router.use("/events", bookingRouter);
router.use("/types", typeRouter);
router.use("/menus", menuRouter);

module.exports = router;