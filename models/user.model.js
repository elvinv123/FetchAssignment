let users = require('../data/users.json')
let balances = require('../data/balance.json')
let transactions = require('../data/transactions.json')
const usersData = './data/users.json'
const balanceData = './data/balance.json'
const transactionsData = './data/transactions.json'
const helper = require('../helpers/helper.js')
const balance = require('./balance.model')

// Returns list of users
function getUsers() {
    return new Promise((resolve, reject) => {
        if (users.length === 0) {
            reject({
                message: 'no users available',
                status: 202
            })
        }
        resolve(users)
    })
}

// Returns specific user given id
function getUser(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(users, id)
            .then(user => resolve(user))
            .catch(err => reject(err))
    })
}

// Creates new user
function insertUser(newUsers) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(users) }
        const date = {
            createdAt: helper.newDate(),
        }
        newUsers = { ...id, ...newUsers, ...date }
        users.push(newUsers)
        balance.insertBalance({userId: id['id']})
        helper.writeJSONFile(usersData, users)
        resolve(newUsers)
    })
}

// Deducts points from user balance
function deductPoints(id, body) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(users, id)
            .then(user => {
                const userIndex = users.findIndex(p => p.id == user.id);
                const balanceIndex = balances.findIndex(p => p.userId == user.id);
                let points = body.points;

                transactions.sort(function(a,b){
                    a = new Date(a.date).getDate();
                    b = new Date(b.date).getDate();
                    return a-b;
                })

                const userTransactionsIndex =[];
                const deductions ={};
                for(let i =0; i< transactions.length; i++){
                    if (Number(transactions[i].userId) !== users[userIndex].id) continue;
                    const partner = transactions[i].partner;
                    userTransactionsIndex.push(i);

                    if (!deductions[partner]) deductions[partner] = 0;

                    if (points - Number(transactions[i].points)< 0){
                        transactions[i].points = -(points - Number(transactions[i].points));
                        balances[balanceIndex][partner] -= points;

                        deductions[partner] -= points;

                        points = 0;
                        userTransactionsIndex.pop()
                        break;
                    }
                    points -= Number(transactions[i].points);
                    balances[balanceIndex][partner] -= Number(transactions[i].points);
                    deductions[partner] -= Number(transactions[i].points);
                }

                transactions = transactions.filter(trans => !userTransactionsIndex.includes(transactions.indexOf(trans)))

                helper.writeJSONFile(balanceData, balances);
                helper.writeJSONFile(usersData, users);
                helper.writeJSONFile(transactionsData, transactions);

                let deductionLog =''
                Object.keys(deductions).forEach(partner=>{
                    deductionLog += `[${partner}, ${deductions[partner]}, now], `
                })
                
                resolve(`Points Deducted: ${deductionLog}`);
            })
            .catch(err => reject(err))
    })
}

// Deletes a user along with its balance
function deleteUser(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(users, id)
            .then(() => {
                users = users.filter(p => p.id !== Number(id))
                helper.writeJSONFile(usersData, users)
                balance.deleteBalance(id)
                resolve()
            })
            .catch(err => reject(err))
    })
}

module.exports = {
    insertUser,
    deductPoints,
    getUsers,
    getUser,
    deleteUser
}