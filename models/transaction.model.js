let transactions = require('../data/transactions.json')
const filename = './data/transactions.json'
const helper = require('../helpers/helper.js')

// Returns list of transactions
function getTransactions() {
    return new Promise((resolve, reject) => {
        if (transactions.length === 0) {
            reject({
                message: 'no transactions available',
                status: 202
            })
        }
        resolve(transactions)
    })
}

// Returns transaction given id
function getTransaction(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(transactions, id)
            .then(transaction => resolve(transaction))
            .catch(err => reject(err))
    })
}

// Creates a transacion (adds points to balance)
function insertTransaction(newTransaction) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(transactions) }
        newTransaction.date = new Date(newTransaction.date)
        newTransaction = { ...id, ...newTransaction }
        transactions.push(newTransaction)
        helper.writeJSONFile(filename, transactions)
        resolve(newTransaction)
    })
}

// Deletes a transaction given id
function deleteTransaction(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(transactions, id)
            .then(() => {
                transactions = transactions.filter(p => p.id !== Number(id))
                helper.writeJSONFile(filename, transactions)
                resolve()
            })
            .catch(err => reject(err))
    })
}

module.exports = {
    insertTransaction,
    getTransactions,
    getTransaction,
    deleteTransaction
}