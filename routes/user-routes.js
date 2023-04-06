const router = require("express").Router();

const usersController = require("../controller/user-controller");
// const checkAuth = require("../middleware/check-auth");

//SignUp API
router.post("/signup", usersController.signup);

//Login API
router.post("/login", usersController.login);

// router.use(checkAuth);

//Get User Details API
router.get("/:userId/dashboard", usersController.getUser);

//Update User API
// router.put("/:id", usersController.updateUser);

module.exports = router;