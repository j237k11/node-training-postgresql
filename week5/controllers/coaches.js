const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('CoachesController')
const appError = require('../utils/appError')
const { isUndefined } = require('../utils/validUtils')
const { isNotValidSting } = require('../utils/validUtils')



async function getCoaches (req, res, next) {
    const { per, page } = req.query
    if(isNotValidSting(per) || isNotValidSting(page)) {
      next(appError(400, "欄位未填寫正確"))
      return
    }
    const perNum = parseInt(req.query.per);
    const pageNum = parseInt(req.query.page);
    const coachList = await dataSource.getRepository('Coach').find({
      select: ['id'],      
      take:perNum,
      skip:(pageNum-1)*perNum,
      
      relations:{
        User: true,
      }      
    })
    
    let coachData = [];
    let coachDataFilter = coachList.filter(function(item,index){
      let coachObj = {};
      coachObj.id = item["User"]["id"];
      coachObj.name = item["User"]["name"];
      coachData.push(coachObj);
    })
    
    res.status(200).json({
        status: "success",
        data: coachData
    })
}

async function getCoachDetail (req, res, next) {
    const { coachId } = req.params
    if(isUndefined(coachId) || isNotValidSting(coachId)){
        logger.warn('欄位未填寫正確')
        next(appError(400, "欄位未填寫正確"))
        return
    }   
    const coachRepository = dataSource.getRepository('Coach')
    const existingCoach = await coachRepository.findOne({
      select: ['id','user_id','experience_years','description','profile_image_url','created_at','updated_at'],
      where: {user_id: coachId}
    })
    const userRepository = dataSource.getRepository('User')    
    const userRepo = await userRepository.findOne({
      select: ['name','role'],
      where: {id: coachId}
    })
    if (!existingCoach){
      logger.warn('找不到該教練')
      next(appError(400, "找不到該教練"))  
      return
    }
    res.status(200).json({
        status: 'success',
        data: {
          user: userRepo,
          coach: existingCoach
        }
    })
}

async function getCoachCourses (req, res, next) {
    const { coachId } = req.params
    if (isUndefined(coachId) || isNotValidSting(coachId)) {
      return  next(appError(400, "欄位未填寫正確"))      
    }
    const coach = await dataSource.getRepository('Coach').findOne({
      select: {
        id: true,
        user_id: true,
        User: {
          name: true
        }
      },
      where: {
        id: coachId
      },
      relations: {
        User: true
      }
    })
    if (!coach) {      
      logger.warn('找不到該教練')
      return next(appError(400, "找不到該教練"))
    }
    logger.info(`coach: ${JSON.stringify(coach)}`)
    const courses = await dataSource.getRepository('Course').find({
      select: {
        id: true,
        name: true,
        description: true,
        start_at: true,
        end_at: true,
        max_participants: true,
        Skill: {
          name: true
        }
      },
      where: {
        user_id: coach.user_id
      },
      relations: {
        Skill: true
      }
    })
    logger.info(`courses: ${JSON.stringify(courses)}`)
    res.status(200).json({
      status: 'success',
      data: courses.map((course) => ({
        id: course.id,
        name: course.name,
        description: course.description,
        start_at: course.start_at,
        end_at: course.end_at,
        max_participants: course.max_participants,
        coach_name: coach.User.name,
        skill_name: course.Skill.name
      }))
    })
}

module.exports = {
  getCoaches,
  getCoachDetail,
  getCoachCourses
}




