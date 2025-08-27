const jwt  = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
//    req.headers.authorization: This is where the client sends the JWT. The header format is typically Bearer <token>.

// .split(' ')[1]: This splits the string at the space and takes the second element, which is the actual token.

    try{
        
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.userData = {userId : decodedToken.userId};
        next();
    }catch(err){
        console.error('Auth error:', err);
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = authMiddleware;