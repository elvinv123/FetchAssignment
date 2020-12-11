const express = require('express')
const router = express.Router()
const transaction = require('../models/transaction.model') //transaction model
const balance = require('../models/balance.model') //balance model
const m = require('../helpers/middlewares')
const users = require('../data/users.json') //user data

const validatePointsInput = require('../validation/addPoints')

// Returns list of transactions for all users (added points)
router.get('/', async (req, res) => {

    await transaction.getTransactions()
        .then(transactions => res.json(transactions))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

// Returns a transaction given an id as a parameter
router.get('/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await transaction.getTransaction(id)
        .then(transaction => res.json(transaction))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

// Creates a new transaction (add points)
// Body of request must have 'userId', 'partner', 'points', and 'date' as keys with the corresponding values as your input
// Date in body of request must be in 'YYYY-MM-DD' format
router.post('/', async (req, res) => {
    let { errors, isValid } = validatePointsInput(req.body);

    if (!users.some(user => user.id ===Number(req.body.userId))){
        isValid = false;
        errors.userId = 'Given user doesn\'t exist'
    }

    if (!isValid) {
        return res.status(400).json(errors);
    }

    await transaction.insertTransaction(req.body)
        .then(transaction =>    {

            balance.updateBalance(req.body.userId, req.body)

            res.status(201).json({
                message: `The transaction #${transaction.id} has been created`,
                content: transaction
            })
        })
        .catch(err => res.status(500).json({ message: err.message }))
})

// Deletes a transaction with given id as parameter
router.delete('/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await transaction.deleteTransaction(id)
        .then(transaction => res.json({
            message: `The transaction #${id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            }
            res.status(500).json({ message: err.message })
        })
})

module.exports = router