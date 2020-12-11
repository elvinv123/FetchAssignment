let balances = require('../data/balance.json')
const filename = './data/balance.json'
const helper = require('../helpers/helper.js')

// Returns user balance given id
function getBalance(id) {
    return new Promise((resolve, reject) => {
        helper.userIdMustBeInArray(balances, id)
            .then(balance => resolve(balance))
            .catch(err => reject(err))
    })
}

// Creates new balance for user
function insertBalance(newBalance) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(balances) }
        const date = {
            createdAt: helper.newDate(),
        }
        newBalance = { ...id, ...newBalance, ...date }
        balances.push(newBalance)
        helper.writeJSONFile(filename, balances)
        resolve(newBalance)
    })
}

// Updates user balance
function updateBalance(id, body) {
    return new Promise((resolve, reject) => {
        helper.userIdMustBeInArray(balances, id)
            .then(balance => {
                if (!balance[body.partner]) balance[body.partner] = 0;
                balance[body.partner] += Number(body.points)
                helper.writeJSONFile(filename, balances)
            })
            .catch(err => reject(err))
    })
}

// Deletes user balance
function deleteBalance(userId) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(balances, userId)
            .then(() => {
                balances = balances.filter(p => p.userId !== Number(userId))
                helper.writeJSONFile(filename, balances)
                resolve()
            })
            .catch(err => reject(err))
    })
}

module.exports = {
    insertBalance,
    getBalance,
    updateBalance,
    deleteBalance
}