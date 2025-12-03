const express= require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')


router.post('/new', userController.createNewUser)
router.put('/update/:id', verifyJWT,userController.updateUser)
router.delete('/delete', verifyJWT, userController.deleteUser)
router.get('/all', userController.getAllUsers)
router.get('/find/:id', userController.getUser)
router.put('/viewed/:id', verifyJWT, userController.updateViewed)
router.put('/save/:id', verifyJWT, userController.saveForLater)


module.exports = router
