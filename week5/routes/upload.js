const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const upload = require('../controllers/upload')
const logger = require('../utils/logger')('Upload')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})
const handleErrorAsync = require('../utils/handleErrorAsync')


router.post('/', auth, handleErrorAsync(upload.postUploadImage))

module.exports = router

