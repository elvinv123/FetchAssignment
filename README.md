# Fetch Rewards Coding Exercise - Backend Software Engineering

## Technologies Used

  * Express.js
  * Node.js
  * Validator

## API Endpoints
### `users`
* `POST /api/users/` - Create new user
* `DELETE /api/users/:id` - Deletes a user with given id
* `PATCH /api/users/deduct/:id` - Deducts points from user balance given userId
* `GET /api/users/` - Returns index of all users
* `GET /api/users/:id` - Returns user with given id
* `GET /api/users/balance/:id` - Returns user balance with given userId
### `transactions`
* `GET /api/transactions/` - Returns list of all transactions
* `GET /api/transactions/:id` - Returns a transaction with given id
* `POST /api/transactions/` - Creates a new transaction (add points)
* `DELETE /api/transactions/:id` - Deletes a transaction with given id

---

## Setup
If Node.js is not already installed on your machine, you can use [this guide](https://nodejs.org/en/download/package-manager/) to install
Clone this repo to your desktop and run `npm install` to install all the dependencies.

## Usage
After you clone this repo to your desktop and install all the dependencies, you can run `npm run server` from the command line to run the server locally on port 5000. After running the server you can test the API endpoints using an API development platform like Postman.

If Postman is not installed on your machine, you can download [here](https://www.postman.com/downloads/)

---

