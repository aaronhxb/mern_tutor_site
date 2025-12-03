const express = require('express')
const router = express.Router()
const videoController = require('../controllers/videoController')
const verifyJWT = require('../middleware/verifyJWT')


router.get("/all", videoController.getAllVideos)
router.get("/find/:id", videoController.getVideo)
router.post("/add", verifyJWT, videoController.addNewVideo)
router.put("/edit/:id", verifyJWT, videoController.editVideo)
router.delete("/delete", verifyJWT, videoController.deleteVideo)
router.get("/search", videoController.searchVideos)
router.get("/tag", videoController.getTagVideos)

module.exports = router