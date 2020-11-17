const router = require("express")();
const postController = require("../controllers/postController.js");


router.get("/:username/posts", postController.posts_get);

module.exports = router;