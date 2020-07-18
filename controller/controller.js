const controller = {};
const db = require('../db/query'); 
const cookie_options =  { "maxAge" : 2700000, "httpOnly": true, "secure": false , "domain" : "localhost"};
const jwt = require('jsonwebtoken');

controller.createTeacher = async(req,res) =>{
 console.log('Register teacher');

 const { username, password, schoolId } = req.body;
 if(!username || !password || !schoolId){
 	return res.status(400).send('Mandatory data missing')
 }

 const school = await db.selectOnSingleKey('school',['name'],[schoolId]);
 if(!school.rowCount){
 	return res.status(400).send('School does not exist')
 }
 await db.insertRow('teacher',['username','password','schoolid'],[username,password,schoolId]);
 return res.status(200).send('Success')
}

controller.login = async(req,res) =>{
 console.log('Login teacher');

 const { username, password } = req.body;

 if(!username || !password){
 	return res.status(400).send('Mandatory data missing')
 }

 const teacher = await db.selectOnTwoKeys('teacher',['id', 'schoolid'],[username,password]);
 if(!teacher.rowCount){
 	return res.status(400).send('Incorrect username or password')
 }
 const { id, schoolid } = teacher.rows[0];
 const token = jwt.sign({id: id,school : schoolid}, 'ABCD', { expiresIn: '7d' });
 res.cookie('X-Token', token, cookie_options);
 return res.status(200).send('Success')
}

controller.addStudent = async(req,res)=>{
 console.log('Add student');

 const teacherId = req.userId;
 const school = req.school;

 const { StudentName, class : className, roll, schoolId , totalMarks} = req.body;

 if(!StudentName || !className || !schoolId ||!roll || !totalMarks){
 	return res.status(400).send('Mandatory data missing')
 }
 if(schoolId !== school){
 	return res.status(400).send('Not allowed to enter data for this school')
 }
 const schoolData = await db.selectOnSingleKey('school',['name'],[schoolId]);
 if(!schoolData.rowCount){
 	return res.status(400).send('School does not exist')
 }
 const student = await db.insertRow('student',['name','class','roll','schoolid'],
 	[StudentName,className,roll,schoolId]);

 const grade = totalMarks > 50 ? 'Pass' : 'Fail';

 await db.insertRow('marks',['totalMarks','grade','teacherid','studentid'],
 	[totalMarks,grade,teacherId, student.rows[0].id]);

 return res.status(200).send('Success')
}

controller.getStudentList = async(req,res)=>{
 console.log('Get Students');

 const teacherId = req.userId;

 const students = await db.getStudentList([teacherId]);

 return res.status(200).send(students.rows)
}

module.exports.controller = controller;