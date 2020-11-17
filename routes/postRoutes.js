const router = require("express")();
const postController = require("../controllers/postController.js");


router.get("/:username/posts", postController.posts_get);

router.get("/:username/posts/create", postController.post_create_get);

router.post("/:username/posts/create", postController.post_create_post);

router.get("/posts", postController.all_posts);

router.get("/:username/posts/:slug", postController.post_detail);

router.get("/:username/posts/:slug/edit", postController.post_edit_get);

router.post("/:username/posts/:slug/edit", postController.post_edit_post);

router.post("/:username/posts/:slug/delete", postController.post_delete);

module.exports = router;