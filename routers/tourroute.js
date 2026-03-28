const express = require('express')
const authenticateuser=require("./../controllers/authenticateuser")



const router = express.Router()

const tourController = require('../controllers/tourController')

//router.param('id', tourController.checkID)










router.route('/tour-stats').get(tourController.tourStats)
router.route('/monthly-tours').get(tourController.monthlyPlan)

router.route('/:id').patch(tourController.tourUpdate).get(tourController.getTour).delete(authenticateuser.protect,authenticateuser.authorize,tourController.deltour)

router.route("/").get(tourController.getAlltours).post(tourController.createTour)

module.exports = router
