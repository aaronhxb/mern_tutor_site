const Video = require('../models/Video')
const User = require('../models/User')

const addNewVideo = async(req, res) => {
    const newVideo = new Video(req.body)
    try{
        await newVideo.save()
        res.status(200).json(newVideo)
    }catch(err){
        res.status(500).json(err)
    }
}

const getAllVideos = async(req,res) => {
    const videos = await Video.find().lean()

    if(!videos?.length) {
        return res.status(400).json("No videos found")
    }
    const videosWithUser = await Promise.all(
        videos.map(async(video) =>{
        const updater = await User.findById(video.user)
        return {...video, username: updater.username }
    }))
    res.json(videosWithUser)
}
const searchVideos = async(req,res) => {  
    const query = req.query.query
    //.log(`query is ${query}  `)
    try {
        const videos = await Video.find({
        title: { $regex: query, $options: "i"},
    }).lean().limit(15)
        if(!videos.length) {
            return res.status(400).json("No videos found")
        }
       const videosWithUser = await Promise.all(
            videos.map(async(video)=>{
                const updater = await User.findById(video.user)
                return {...video, username: updater.username}
        }))
        res.status(200).json(videosWithUser)
    } catch (err){
        res.status(500).json(err)
    }
}

const getTagVideos = async(req, res)=> {
    const tag = req.query.tag
    //console.log(`tag is ${tag}  `)
    try{
        const videos = await Video.find(
            { 
                tags: { $in: tag }
            }).lean().limit(10)
        if (!videos?.length) {
            return res.status(400).json("No videos found")
        }
        const videosWithUser = await Promise.all(
            videos.map(async(video)=>{
                const uploader = await User.findById(video.user)
                return {...video, username:uploader.username}
            })
        )
        res.status(200).json(videos)
    }catch(err){
        res.status(500).json(err)
    }
}

const getVideo = async(req, res) => {
  
    const video = await Video.findByIdAndUpdate(
        req.params.id,
        {
            $inc: { views: 1 }
        }
    )
    if(!video) {
        return res.status(400).json("No video found")
    }
    //console.log(video)
    res.status(200).json(video)
}

const editVideo = async(req,res) => {
    const video = await Video.findById(req.params.id)
    if(!video){
        return res.status(400).json("No video found")
    }
    try{
        const editedVideo = await Video.findByIdAndUpdate(
            req.params.id, 
            {
                $set: req.body
            },
            { new: true }
        )
        res.status(200).json(`Video ${editedVideo.title} has been edited`)
    }catch(err){
        res.status(500).json(err)
    }
}

const deleteVideo = async(req,res) => {
    const video = await Video.findById(req.body.id)
    if (!video){
        return res.status(400).json("No video found")
    }
    try{
        await video.deleteOne()
        return res.status(200).json(` ${video.title} is deleted`)
    }catch(err){
        res.status(500).json(err)
    }
}

module.exports = {
    addNewVideo,
    getAllVideos,
    searchVideos,
    getTagVideos,
    editVideo,
    deleteVideo,
    getVideo
}