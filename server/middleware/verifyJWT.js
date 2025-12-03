const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization ||  req.headers.Authorization
    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json("Unauthorized")
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY,
        (err, decode) => {
            if(err){
                return res.status(403).json("Forbidden")
            }
            req.username = decode.username
            req.userId = decode.userId
            next()
        }
    )

}

module.exports = verifyJWT