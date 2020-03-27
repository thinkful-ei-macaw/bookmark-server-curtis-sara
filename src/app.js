require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarkRouter = require('./bookmark/bookmark-router')
const app = express()
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use((error, req, res, next) => {
  let message
  if (NODE_ENV === 'production') {
    message = 'Server error'
  }
  else {
    console.error(error)
    message = error.message
  }
  res.status(500).json(message)
})

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`)
    return res
      .status(401)
      .json({
        error: 'Unauthorized request'
      })
  }
  next()
})

app.use(bookmarkRouter)
//add app.use for Routers UNDER validation function

module.exports = app