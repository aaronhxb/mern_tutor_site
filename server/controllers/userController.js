const User = require('../models/User')
const Video = require('../models/Video')
const bcrypt = require('bcrypt')

const getAllUsers = async(req,res) => {
    try {
        const users = await User.find().select('-password').lean()
        res.json(users)
    } catch(err){
        res.status(500).json(err)
    }
}

const createNewUser = async(req,res) =>{
    const {username, email, password} = req.body
    if(!username || !email || !password) {
        return res.status(400).json({message: 'All fields need to be filled'})
    }
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    const duplicateEmail = await User.findOne({ email }).lean().exec()

    if (duplicateEmail) {
        return res.status(409).json({ message: 'Duplicate email' })
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = new User({username, email, password:hashedPassword})
    try{
        await newUser.save()
        res.status(201).json({message:'New user is created'})
    }catch(err){
        res.status(500).json(err)
    }
}

const updateUser = async(req,res) => {
    //chech whether the logged user is the same user
    //console.log("req.userID is ", req.userId)
    if (req.userId !== req.params.id){
        return res.status(401).json({message:'Not your account'})
    }
    
    const { username, email, password } = req.body
    try {
        if (password) {
            password = await bcrypt.hash(password, 10)
        }
        const updaterdUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                $set: {
                    username: username,
                    email: email,
                    password: password
                },
            },
            { new: true }
        )
        res.status(200).json(`Successfully Upadate user ${updaterdUser.username}`)
    } catch(err) {
        res.status(500).json(err)
    }
}

const updateViewed = async(req,res) =>{
    if (req.userId !== req.body.userId){
        return res.status(401).json({message:'Not your account'})
    }
    try{
        const user = await User.findById(req.userId)

        const view = user.viewed.find(
            (view)=>(view.videoId === req.params.id))
        if(view) {
            view.watchDate = req.body.date
        }else{
            user.viewed.push({
                videoId: req.params.id, 
                watchDate: req.body.date
            })
        }
        
        await user.save()
        
        res.status(200).json( user.viewed)
    }catch(err){
        res.status(500).json(err)
    }
}

const saveForLater = async(req,res) =>{
    if (req.userId !== req.body.userId){
        return res.status(401).json({message:'Not your account'})
    }
    try{
        const user = await User.findById(req.userId)

        const saved = user.saved.find(
            (video)=>(video === req.params.id))
        if(saved) {
            return res.status(400).json({message:'Already in your library'})
        }else{
            user.saved.unshift(req.params.id);
            //user.saved.push(req.params.id)
        }
        
        await user.save()
        
        res.status(200).json(user.saved)
    }catch(err){
        res.status(500).json(err)
    }
}

const deleteUser = async(req,res) => {
    if(req.userId !== req.params.id) {
        return res.status(401).json("Cannot delete this account")
    }
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("this users has been deleted")
    } catch(err){
        res.status(500).json(err)
    }
}

const getUser = async(req,res) =>{
    try {
        const user = await User.findById(req.params.id).select('-password')
        if(!user) {
            return res.status(400).json({message: "No user found"})
        }
        
        res.json(user)
    }catch(err){
        res.status(500).json(err)
    }
}

module.exports ={
    createNewUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    saveForLater,
    updateViewed,
}