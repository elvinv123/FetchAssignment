const express = require('express')
const router = express.Router()
const users = require('./user.routes'); // users router
const transactions = require('./transaction.routes'); // transaction router

router.use('/api/transactions', transactions) // If a request matches route in first argument, send router in second argument
router.use('/api/users', users)

module.exports = router