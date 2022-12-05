const router = require('express').Router()
const { getUsers } = require('../../controllers/userController.js')

router.route('/').get(getUsers)

module.exports = router
