const { Router } = require("express");
const typeController = require("../controllers/TypeController");
const router = Router();

const validateLogin = require("../middlewares/validateLogin");

router.get("/", validateLogin, typeController.getAll);
router.post("/add-type", validateLogin, typeController.addNew);

module.exports = router;