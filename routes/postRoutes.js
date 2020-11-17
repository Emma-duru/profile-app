const router = require("express")();
const postController = require("../controllers/postController.js");


router.get("/:username/posts", postController.posts_get);

router.get("/:username/posts/create", postController.post_create_get);

router.post("/:username/posts/create", postController.post_create_post);

module.exports = router;