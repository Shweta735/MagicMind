const { Client } = require("pg");

const db = {};

let client;

const createClient = ()=>{
  client = new Client({
    user: "postgres",
    host: "localhost",
    database: "test",
    password: '1234',
    port: "5432"
  });
  client.connect();
}

db.init = async () => {
  createClient();
  try {
    //initializing the db
    await client.query(`CREATE TABLE IF NOT EXISTS school(id SERIAL UNIQUE,name varchar(50),address varchar(50),phone varchar(15))`);
    await client.query(`INSERT INTO school(id,name,address,phone) values(1,'Test School1','Test',9871111111),
      (2,'Test School2','Test',9871111112) ON CONFLICT DO NOTHING`) ;
    await client.query(`CREATE TABLE IF NOT EXISTS teacher(id SERIAL UNIQUE,
     username varchar(50),password varchar(50), schoolid bigint REFERENCES school(id)) `);
    await client.query(`CREATE TABLE IF NOT EXISTS student(id SERIAL UNIQUE,
     name varchar(50),class varchar(10), roll varchar(15), schoolid bigint REFERENCES school(id)) `);
    await client.query(`CREATE TABLE IF NOT EXISTS marks(id SERIAL UNIQUE,
     totalmarks bigint,grade varchar(10), teacherid bigint REFERENCES teacher(id), studentid bigint REFERENCES student(id))`);
} catch (err) {
    console.log(err.stack);
} finally {
    client.end();
}
};

db.insertRow = async(tablename, keys, value) =>{
  try{
    createClient();
    let flatValueParamString = '';
    for (let i = 0; i < keys.length; i++) {
      flatValueParamString += `$${i+1},`;
    }
    flatValueParamString = flatValueParamString.slice(0, -1);
    const res = await client.query(`INSERT INTO ${tablename}( ${keys.join()} ) VALUES (${flatValueParamString}) RETURNING id;`,value);
    return res;
  }catch(err){
    throw new Error(err)
  }
}  

db.selectOnSingleKey = async(tablename,keys,value) =>{
  try{
    createClient();
    const res = await client.query(`SELECT ${keys.join()} FROM ${tablename} where id = $1;`, value);
    return res;
  }catch(err){
    throw new Error(err)
  }
}  

db.selectOnTwoKeys = async(tablename,keys,value) =>{
  try{
    createClient();
    const res = await client.query(`SELECT ${keys.join()} FROM ${tablename} where username= $1 and password = $2;`, value);
    return res;
  }catch(err){
    throw new Error(err)
  }
}  

db.getStudentList = async(value) =>{
  try{
    createClient();
    const res = await client.query(`SELECT student.name as studentname,class,roll,school.name as schoolname,address,phone,totalmarks,
      grade, teacher.username as teachername FROM student inner join school on school.id = student.schoolid 
      inner join teacher on teacher.schoolid = school.id inner join marks on marks.teacherid = teacher.id and marks.studentid = student.id
      where teacher.id = $1`, value);
    return res;
  }catch(err){
    throw new Error(err)
  }
}                                                                 

module.exports = db;
