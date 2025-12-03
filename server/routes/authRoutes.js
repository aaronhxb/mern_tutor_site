const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/signin', authController.signIn)
router.post('/google', authController.googleAuth)
router.get('/refresh', authController.refresh)
router.post('/signout', authController.signOut)


module.exports = router