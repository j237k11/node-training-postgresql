const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Admin')
const isCoach = require('../middlewares/isCoach')
const config = require('../config/index')
const auth = require('../middlewares/auth')({
  secret: config.get('secret').jwtSecret,
  userRepository: dataSource.getRepository('User'),
  logger
})
const admin = require('../controllers/admin')
const handleErrorAsync = require('../utils/handleErrorAsync')


router.post('/coaches/courses', auth, isCoach, handleErrorAsync(admin.postCourse))

router.put('/coaches/courses/:courseId', auth, handleErrorAsync(admin.putCoachCourseDetail))

router.post('/coaches/:userId', handleErrorAsync(admin.postCoach))

router.get('/coaches/courses', auth, isCoach, handleErrorAsync(admin.getCoachCourses))

router.get('/coaches/courses/:courseId', auth, handleErrorAsync(admin.getCoachCourseDetail))

router.put('/coaches', auth, isCoach, handleErrorAsync(admin.putCoachProfile))

router.get('/coaches', auth, isCoach, handleErrorAsync(admin.getCoachProfile))

router.get('/coaches/revenue', auth, isCoach, handleErrorAsync(admin.getCoachRevenue))

module.exports = router



