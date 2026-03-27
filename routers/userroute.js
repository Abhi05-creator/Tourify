const express=require('express')
const router=express.Router()

const usersController=require('../controllers/usersController')
const authenticateuser=require('../controllers/authenticateuser')

router.post('/signup',authenticateuser.signup)
router.post('/login',authenticateuser.login)





router.delete("/deletemy",authenticateuser.protect,usersController.Deleteme)
router.route('/').get(usersController.getAllusers).post(usersController.createUsers)

router.route('/:id').get(usersController.getUser).patch(usersController.updateUser).delete(usersController.delUser)

module.exports=router
