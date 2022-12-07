const router = require('express').Router()
const { 
    getUsers, 
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../../controllers/userController.js')

router.route('/').get(getUsers).post(createUser);


router.route('/:userId').get(getUser).put(updateUser).delete(deleteUser)


module.exports = router
