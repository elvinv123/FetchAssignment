const express = require('express')
const router = express.Router()
const user = require('../models/user.model') // user model
const balance = require('../models/balance.model') // balance model
const m = require('../helpers/middlewares')
const users = require('../data/users.json') // user data

const validatePointsDeduction = require('../validation/deductPoints')
const validateNewUser = require('../validation/newUser')


// Returns list of users 
router.get('/', async (req, res) => {
    await user.getUsers()
        .then(users => res.json(users))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

// Returns a user given an id as a parameter
router.get('/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await user.getUser(id)
        .then(user => res.json(user))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

// Returns a user balance given a userId as a parameter
router.get('/balance/:id', async (req, res) => {
    const id = req.params.id
    await balance.getBalance(id)
        .then(balance => res.json(balance))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

// Creates a user
// Body of request must have 'username', and 'email' as keys with the corresponding values as your input
// Username in body of request must be at least 5 characters
router.post('/', async (req, res) => {
    let { errors, isValid } = validateNewUser(req.body);

    users.forEach(user =>{
        if (user.username === req.body.username){
            isValid = false;
            errors.username = 'This username already exists'
        }
        if (user.email === req.body.email) {
            isValid = false;
            errors.email = 'This email already is already registered'
        }
    })

    if (!isValid) {
        return res.status(400).json(errors);
    }

    await user.insertUser(req.body)
        .then(user => res.status(201).json({
            message: `The user #${user.id} has been created`,
            content: user
        }))
        .catch(err => res.status(500).json({ message: err.message }))
})

// Deducts points from user balance given a userId as a parameter
// Body of request must have 'points' as a key with the corresponding value as your input
router.patch('/deduct/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id
    const { errors, isValid } = validatePointsDeduction(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    await user.deductPoints(id, req.body)
        .then(user => 
            
            {res.json({
                message: `The user #${id} has been updated`,
                content: user
                })
            }
        )
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            }
            res.status(500).json({ message: err.message })
        })
})

// Deletes a user given a userId as a parameter
router.delete('/:id', m.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await user.deleteUser(id)
        .then(user => res.json({
            message: `The user #${id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            }
            res.status(500).json({ message: err.message })
        })
})

module.exports = router