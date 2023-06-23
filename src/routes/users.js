const { Router } = require("express");
const UserController = require("../controllers/UserController");
const router = Router();

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.post("/upload", UserController.uploadPhoto);

module.exports = router;