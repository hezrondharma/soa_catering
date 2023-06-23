const { Router } = require("express");
const menuController = require("../controllers/MenuController");
const validateLogin = require("../middlewares/validateLogin");
const router = Router();

router.get("/available", validateLogin, menuController.searchAvail);
router.post("/add-menu", validateLogin, menuController.addMenu);
router.get("/get", validateLogin, menuController.searchMenuKeyword);
router.get("/get/:tipe", validateLogin, menuController.searchMenuType);
router.put("/update/:id", validateLogin, menuController.updateMenu);
router.post("/photos/:id", validateLogin, menuController.uploadPhoto);
router.delete("/delete/:id", validateLogin, menuController.deleteMenu);
router.put("/restore/:id", validateLogin, menuController.restoreMenu);

module.exports = router;