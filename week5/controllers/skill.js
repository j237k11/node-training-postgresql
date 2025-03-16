const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('SkillController')
const appError = require('../utils/appError')
const { isUndefined } = require('../utils/validUtils')
const { isNotValidSting } = require('../utils/validUtils')


async function getSkill (req, res, next) {
    const skills = await dataSource.getRepository('Skill').find({
      select: ['id', 'name']
    })
    res.status(200).json({
      status: 'success',
      data: skills
    })
}

async function postSkill (req, res, next) {
    const { name } = req.body
    if (isUndefined(name) || isNotValidSting(name)) {
      return next(appError(400, "欄位未填寫正確"))      
    }
    const skillRepo = dataSource.getRepository('Skill')
    const existSkill = await skillRepo.findOne({
      where: {
        name
      }
    })
    if (existSkill) {
      return next(appError(400, "資料重複"))
    }
    const newSkill = await skillRepo.create({
      name
    })
    const result = await skillRepo.save(newSkill)
    res.status(200).json({
      status: 'success',
      data: result
    })
}

async function deletePackage (req, res, next) {
    const { skillId } = req.params
    if (isUndefined(skillId) || isNotValidSting(skillId)) {
      return next(appError(400, "ID錯誤"))
    }
    const result = await dataSource.getRepository('Skill').delete(skillId)
    if (result.affected === 0) {
      return next(appError(400, "ID錯誤"))
    }
    res.status(200).json({
      status: 'success'
    })
}

module.exports = {
  getSkill,
  postSkill,
  deletePackage
}
