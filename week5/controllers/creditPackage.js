const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CreditPackageController')
const appError = require('../utils/appError')
const { isUndefined } = require('../utils/validUtils')
const { isNotValidSting } = require('../utils/validUtils')
const { isNotValidInteger } = require('../utils/validUtils')


async function getPackage (req, res, next) {
    const creditPackages = await dataSource.getRepository('CreditPackage').find({
      select: ['id', 'name', 'credit_amount', 'price']
    })
    res.status(200).json({
      status: 'success',
      data: creditPackages
    })
}

async function postPackage (req, res, next) {
    const { name, credit_amount: creditAmount, price } = req.body
    if (isUndefined(name) || isNotValidSting(name) ||
      isUndefined(creditAmount) || isNotValidInteger(creditAmount) ||
      isUndefined(price) || isNotValidInteger(price)) {
      return next(appError(400, "欄位未填寫正確"))      
    }
    const creditPackageRepo = dataSource.getRepository('CreditPackage')
    const existCreditPackage = await creditPackageRepo.findOne({
      where: {
        name
      }
    })
    if (existCreditPackage) {
      return next(appError(400, "資料重複"))
    }
    const newCreditPackage = await creditPackageRepo.create({
      name,
      credit_amount: creditAmount,
      price
    })
    const result = await creditPackageRepo.save(newCreditPackage)
    res.status(200).json({
      status: 'success',
      data: result
    })
}

async function postUserBuy (req, res, next) {
    const { id } = req.user
    const { creditPackageId } = req.params
    const creditPackageRepo = dataSource.getRepository('CreditPackage')
    const creditPackage = await creditPackageRepo.findOne({
      where: {
        id: creditPackageId
      }
    })
    if (!creditPackage) {
      return next(appError(400, "ID錯誤"))      
    }
    const creditPurchaseRepo = dataSource.getRepository('CreditPurchase')
    const newPurchase = await creditPurchaseRepo.create({
      user_id: id,
      credit_package_id: creditPackageId,
      purchased_credits: creditPackage.credit_amount,
      price_paid: creditPackage.price,
      purchaseAt: new Date().toISOString()
    })
    await creditPurchaseRepo.save(newPurchase)
    res.status(200).json({
      status: 'success',
      data: null
    })
}

async function deletePackage (req, res, next) {
    const { creditPackageId } = req.params
    if (isUndefined(creditPackageId) || isNotValidSting(creditPackageId)) {
      return next(appError(400, "欄位未填寫正確"))      
    }
    const result = await dataSource.getRepository('CreditPackage').delete(creditPackageId)
    if (result.affected === 0) {
      return next(appError(400, "ID錯誤"))
    }
    res.status(200).json({
      status: 'success',
      data: result
    })
}

module.exports = {
  getPackage,
  postPackage,
  postUserBuy,
  deletePackage
}






