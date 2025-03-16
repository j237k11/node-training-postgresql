const express = require('express')

const router = express.Router()
const skill = require('../controllers/skill')
const handleErrorAsync = require('../utils/handleErrorAsync')

router.get('/', handleErrorAsync(skill.getSkill))

router.post('/', handleErrorAsync(skill.postSkill))

router.delete('/:skillId', handleErrorAsync(skill.deletePackage))

module.exports = router