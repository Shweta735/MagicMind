
const ipcheck = async(req,res,next) => {
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || req.hostname;
  if (ip.includes('127.0.0.1'))
    next();
  else
  	return res.status(400).send('Invalid IP');
 }

  module.exports = ipcheck;