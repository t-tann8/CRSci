require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.AWS_USERNAME,
    "password": process.env.AWS_PASSWORD,
    "database": process.env.AWS_DATABASE,
    "host": process.env.AWS_HOST,
    "dialect": process.env.AWS_DIALECT,
    "dialectOptions": {
      "ssl": false
    }
  },
  "test": {
    "username": process.env.AWS_USERNAME,
    "password": process.env.AWS_PASSWORD,
    "database": process.env.AWS_DATABASE,
    "host": process.env.AWS_HOST,
    "dialect": process.env.AWS_DIALECT,
    "dialectOptions": {
      "ssl": false
    }
  },
  "production": {
    "username": process.env.AWS_USERNAME,
    "password": process.env.AWS_PASSWORD,
    "database": process.env.AWS_DATABASE,
    "host": process.env.AWS_HOST,
    "dialect": process.env.AWS_DIALECT,
    "dialectOptions": {
      "ssl": false
    }
  },
}
