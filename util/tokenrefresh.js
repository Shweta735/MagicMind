
const jwt = require('jsonwebtoken');

const TokenRefresh = {};

const cookie_options =  { "maxAge" : 2700000, "httpOnly": true, "secure": false , "domain" : "localhost"};

TokenRefresh.refresh = async (req, res, next) => {
  let { token } = req;

  if (!token) {
    const cookie = req.cookies;
    // check if cookie is present or not
    if (!(_.isEmpty(cookie)) && Object.prototype.hasOwnProperty.call(cookie, 'X-Token')) {
      token = cookie['X-Token'];
    }
  }

  if (!token) {
    res.status(400).send('No Authorization Token');
  } else {
    try {
      jwt.verify(token,'ABCD', (err, decoded) => {
      if (err) {
       throw new Error(err)
      }
      req.userId = decoded.id;
      const expiration = decoded.exp;
      const currTime = Math.round((new Date()).getTime() / 1000);
      if ((expiration - currTime) < 300) {
        // reissue JWT Token
        
        const refreshToken = jwt.sign({id: decoded.id}, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('X-Token', refreshToken, cookie_options);
      }
      next();
    })
  }catch (error) {
    res.status(401).send('Invalid Token');
  }
};

module.exports.TokenRefresh = TokenRefresh;
