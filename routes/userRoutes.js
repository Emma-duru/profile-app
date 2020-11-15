const router = require("express")();
const userController = require("../controllers/userController");

router.get("/", userController.home_get);

router.get("/signup", userController.signup_get);

router.post("/signup", userController.signup_post);

router.get("/login", userController.login_get);

router.post("/login", userController.login_post);

router.get("/:username/profile", userController.profile_get);

router.get("/:username/profile/edit", userController.profile_edit_get);

router.post("/:username/profile/edit", userController.profile_edit_post);

router.get("/profiles", userController.user_list);

router.get("/logout", userController.logout);


module.exports = router;