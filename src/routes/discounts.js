const { Router } = require("express");
const DiscountController= require("../controllers/DiscountController");
const router = Router();

const validateManager = require("../middlewares/validateManager");

router.get("/list", validateManager, DiscountController.getAll);
router.post("/add", validateManager, DiscountController.addDiscount);
router.put("/update/:id", validateManager, DiscountController.updateDiscount);

module.exports = router;