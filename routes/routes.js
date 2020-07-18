const express = require('express');
const { controller } = require('../controller/controller');
const { TokenRefresh } = require('../util/Token');

const router = express.Router();

router.post('/teacher', controller.createTeacher);

router.post('/login', controller.login);

router.post('/student', TokenRefresh.refresh, controller.addStudent);

router.get('/student',TokenRefresh.refresh, controller.getStudentList)

module.exports = router;