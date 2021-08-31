
/**
 * index of existing routers
 */
const router = require('express').Router();

router.use('/users', require('./users.routes'));
router.use('/tenants', require('./tenants.routes'));


module.exports = router;