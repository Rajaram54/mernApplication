const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    let token = req.header('x-auth-token');

    console.log(token);

    if(!token){
        res.status(401).json({msg: 'Token missing!!!'});
    }

    try {
        const decode = jwt.verify(token, config.get('jwtSecret'));
        req.user = decode.user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(400).json({msg: 'Error in Token!!!'});
    }
}