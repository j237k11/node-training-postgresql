const express = require('express')

const router = express.Router()
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackage')
const creditPackage = require('../controllers/creditPackage')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})
const handleErrorAsync = require('../utils/handleErrorAsync')

router.get('/', handleErrorAsync(creditPackage.getPackage))

router.post('/', handleErrorAsync(creditPackage.postPackage))

router.post('/:creditPackageId', auth, handleErrorAsync(creditPackage.postUserBuy))

router.delete('/:creditPackageId', handleErrorAsync(creditPackage.deletePackage))

module.exports = router