const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const signIn = async(req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json("All fields are required")
    }
    const foundUser = await User.findOne({ username }).lean()
    if(!foundUser) {
        return res.status(401).json("The user is not exit")
    }

    const isMatch = await bcrypt.compare(password, foundUser.password)
    if (!isMatch) {
        return res.status(401).json("Unauthorized")
    }

    const accessToken = jwt.sign(
        {   
            "username": foundUser.username,
            "userId": foundUser._id
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: '1m' }
    )
    const freshToken = jwt.sign(
        { "username":foundUser.username,
            "userId": foundUser._id
         },
        process.env.FRESH_TOKEN_KEY,
        { expiresIn: '10m' }
    )
    res.cookie('jwt', freshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 1 * 60 * 60 * 1000
    })
    res.json({accessToken})
}

const googleAuth = async(req, res) => {
    const { username, email } = req.body
    const googleUser = await User.findOne({username})
    if(!googleUser) {
        const newUser = new User({username, email})
        await newUser.save()
        const accessToken = jwt.sign(
            {   
                "username": newUser.username,
                "userId": newUser._id
            },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '1m' }
        )
        const freshToken = jwt.sign(
            { "username":newUser.username,
                "userId": newUser._id
             },
            process.env.FRESH_TOKEN_KEY,
            { expiresIn: '10m' }
        )
        res.cookie('jwt', freshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 1 * 60 * 60 * 1000
        })
        res.json({accessToken})
    }else{
        const accessToken = jwt.sign(
            {   
                "username": googleUser.username,
                "userId": googleUser._id
            },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: '1m' }
        )
        const freshToken = jwt.sign(
            { "username":googleUser.username,
                "userId": googleUser._id
             },
            process.env.FRESH_TOKEN_KEY,
            { expiresIn: '10m' }
        )
        res.cookie('jwt', freshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 1 * 60 * 60 * 1000
        })
        res.json({accessToken})
    }
    
}

const refresh = (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) {
        return res.status(401).json("No cookies")
    }
    const freshToken = cookies.jwt

    jwt.verify(
        freshToken,
        process.env.FRESH_TOKEN_KEY,
        async(err, decode) => {
            if (err) {
                return res.status(403).json("It is Forbidden")
            }
            const foundUser = await User.findOne({ username: decode.username })
            if (!foundUser) {
                return res.status(401).json("Unauthorized")
            }
            const accessToken = jwt.sign(
                {   "username": decode.username,
                    "userId": decode.userId
                 },
                process.env.ACCESS_TOKEN_KEY,
                { expiresIn: '1m' }
            )
            res.json({accessToken})
        }
    )

}

const signOut = async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true} )
    res.json("User has been signed out")
}



module.exports ={
    signIn,
    googleAuth,
    refresh,
    signOut
}