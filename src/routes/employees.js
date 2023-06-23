const { Router } = require("express");
const employeeController = require("../controllers/EmployeeController");
const router = Router();

const validateManager = require("../middlewares/validateManager");

router.get("/list", validateManager, employeeController.getAll);
router.get("/search", validateManager, employeeController.searchKaryawan);
router.put("/update", validateManager, employeeController.updateKaryawan);
router.delete("/delete", validateManager, employeeController.deleteKaryawan);

module.exports = router;