const router = require('express').Router();
const apiRoutes = require('./api')


router.use('/api', apiRoutes);

router.use(function (req, res) {
    return res.send('Wrong route');
})


module.exports = router;