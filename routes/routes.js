const express = require('express');
const { controller } = require('../controller/controller');
const { TokenRefresh } = require('../util/Token');
const ipcheck = require('../util/ipcheck');

const router = express.Router();

router.post('/teacher', ipcheck, controller.createTeacher);

router.post('/login', ipcheck, controller.login);

router.post('/student', ipcheck,TokenRefresh.refresh, controller.addStudent);

router.get('/student',ipcheck,TokenRefresh.refresh, controller.getStudentList)

module.exports = router;