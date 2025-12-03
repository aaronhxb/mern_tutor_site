require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { options } = require('./routes/userRoutes')
const allowedOrigins = require('./config/allowedOrigins')
const PORT = process.env.PORT || 3500
//const errorHandler = require('./middleware/errorHandler')

//console.log(process.env.NODE_ENV)

connectDB()

//middleware
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

//routes
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/videos', require('./routes/videoRoutes'))


//app.use(errorHandler())
app.use((err, req, res, next) => {
    const status = res.statusCode ? res.statusCode : 500
    res.status(status)

    res.json({ message: err.message})
})

mongoose.connection.once('open', () => {
    console.log('connected to the MongoDB')
    app.listen(PORT, ()=>{console.log(`Server running successfully on port ${PORT}`)})
})

